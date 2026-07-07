import os
import shutil
import uuid
from datetime import datetime, timedelta
from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import Base, engine, get_db
from models import Animal, Oferta, EstadoAnimalEnum, PropositoEnum
from schemas import (
    AnimalCreate, AnimalOut, AnimalAdminOut, AnimalRechazar,
    OfertaCreate, OfertaOut, CerrarVentaRequest, AdminLogin,
)

ADMIN_CLAVE = os.getenv("ADMIN_CLAVE", "cambiar-esta-clave")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ganado Putumayo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ajustar a dominio real del frontend en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# ---------------------------------------------------------------------------
# Rate limiting muy simple en memoria (por IP) para evitar spam de publicaciones.
# Para producción real con más tráfico, esto debería pasar a Redis.
# ---------------------------------------------------------------------------
_publicaciones_recientes: dict[str, list[datetime]] = {}
LIMITE_PUBLICACIONES = 3
VENTANA_HORAS = 24


def chequear_rate_limit(ip: str):
    ahora = datetime.utcnow()
    historial = _publicaciones_recientes.get(ip, [])
    historial = [t for t in historial if ahora - t < timedelta(hours=VENTANA_HORAS)]
    if len(historial) >= LIMITE_PUBLICACIONES:
        raise HTTPException(
            status_code=429,
            detail=f"Límite de {LIMITE_PUBLICACIONES} publicaciones por {VENTANA_HORAS}h alcanzado. Intenta más tarde.",
        )
    historial.append(ahora)
    _publicaciones_recientes[ip] = historial


def verificar_admin(x_admin_clave: Optional[str] = Header(None)):
    if not x_admin_clave or x_admin_clave != ADMIN_CLAVE:
        raise HTTPException(status_code=401, detail="No autorizado")
    return True


# ---------------------------------------------------------------------------
# Endpoints públicos
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {"status": "ok", "service": "Ganado Putumayo API"}


@app.get("/api/animales", response_model=List[AnimalOut])
def listar_animales_publico(
    proposito: Optional[PropositoEnum] = None,
    zona: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Catálogo público: solo animales aprobados y disponibles o en negociación."""
    query = db.query(Animal).filter(
        Animal.estado.in_([EstadoAnimalEnum.disponible, EstadoAnimalEnum.en_negociacion])
    )
    if proposito:
        query = query.filter(Animal.proposito == proposito)
    if zona:
        query = query.filter(Animal.zona.ilike(f"%{zona}%"))
    return query.order_by(Animal.creado_en.desc()).all()


@app.get("/api/animales/{animal_id}", response_model=AnimalOut)
def obtener_animal(animal_id: str, db: Session = Depends(get_db)):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal or animal.estado not in (EstadoAnimalEnum.disponible, EstadoAnimalEnum.en_negociacion, EstadoAnimalEnum.vendido):
        raise HTTPException(status_code=404, detail="Animal no encontrado")
    return animal


@app.post("/api/animales", response_model=AnimalOut, status_code=201)
def publicar_animal(
    request: Request,
    raza: str = Form(...),
    es_criollo: bool = Form(False),
    edad_meses: Optional[int] = Form(None),
    peso_kg: Optional[float] = Form(None),
    proposito: PropositoEnum = Form(PropositoEnum.carne),
    descripcion: Optional[str] = Form(None),
    precio_piso: Optional[float] = Form(None),
    precio_esperado: Optional[float] = Form(None),
    propietario_nombre: str = Form(...),
    propietario_telefono: str = Form(...),
    zona: Optional[str] = Form(None),
    foto: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """
    Publicación abierta sin necesidad de cuenta, pero queda en estado
    'pendiente' hasta que el admin la revise y apruebe. Esto evita que
    entre basura/spam directo al catálogo público.
    """
    ip = request.client.host if request.client else "unknown"
    chequear_rate_limit(ip)

    datos = AnimalCreate(
        raza=raza,
        es_criollo=es_criollo,
        edad_meses=edad_meses,
        peso_kg=peso_kg,
        proposito=proposito,
        descripcion=descripcion,
        precio_piso=precio_piso,
        precio_esperado=precio_esperado,
        propietario_nombre=propietario_nombre,
        propietario_telefono=propietario_telefono,
        zona=zona,
    )

    foto_url = None
    if foto and foto.filename:
        ext = os.path.splitext(foto.filename)[1].lower()
        if ext not in (".jpg", ".jpeg", ".png", ".webp"):
            raise HTTPException(status_code=400, detail="Formato de imagen no permitido")
        nombre_archivo = f"{uuid.uuid4()}{ext}"
        ruta = os.path.join(UPLOAD_DIR, nombre_archivo)
        with open(ruta, "wb") as f:
            shutil.copyfileobj(foto.file, f)
        foto_url = f"/uploads/{nombre_archivo}"

    nuevo = Animal(
        **datos.model_dump(),
        foto_url=foto_url,
        estado=EstadoAnimalEnum.pendiente,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.post("/api/animales/{animal_id}/ofertas", response_model=OfertaOut, status_code=201)
def registrar_oferta(animal_id: str, oferta: OfertaCreate, db: Session = Depends(get_db)):
    """
    Registro de interés/oferta. En esta v1 el contacto real ocurre por WhatsApp
    (botón en el frontend), pero registramos la oferta para que el admin
    tenga trazabilidad y pueda calcular comisión al cerrar venta.
    """
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal or animal.estado not in (EstadoAnimalEnum.disponible, EstadoAnimalEnum.en_negociacion):
        raise HTTPException(status_code=404, detail="Animal no disponible")

    nueva_oferta = Oferta(animal_id=animal_id, **oferta.model_dump())
    db.add(nueva_oferta)

    if animal.estado == EstadoAnimalEnum.disponible:
        animal.estado = EstadoAnimalEnum.en_negociacion

    db.commit()
    db.refresh(nueva_oferta)
    return nueva_oferta


# ---------------------------------------------------------------------------
# Endpoints de administración (protegidos con clave simple vía header)
# ---------------------------------------------------------------------------

@app.post("/api/admin/login")
def admin_login(datos: AdminLogin):
    if datos.clave != ADMIN_CLAVE:
        raise HTTPException(status_code=401, detail="Clave incorrecta")
    return {"ok": True}


@app.get("/api/admin/animales", response_model=List[AnimalAdminOut])
def listar_todos_admin(
    estado: Optional[EstadoAnimalEnum] = None,
    db: Session = Depends(get_db),
    _=Depends(verificar_admin),
):
    query = db.query(Animal)
    if estado:
        query = query.filter(Animal.estado == estado)
    return query.order_by(Animal.creado_en.desc()).all()


@app.post("/api/admin/animales/{animal_id}/aprobar", response_model=AnimalAdminOut)
def aprobar_animal(animal_id: str, db: Session = Depends(get_db), _=Depends(verificar_admin)):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="No encontrado")
    animal.estado = EstadoAnimalEnum.disponible
    animal.aprobado_en = datetime.utcnow()
    db.commit()
    db.refresh(animal)
    return animal


@app.post("/api/admin/animales/{animal_id}/rechazar", response_model=AnimalAdminOut)
def rechazar_animal(
    animal_id: str,
    datos: AnimalRechazar,
    db: Session = Depends(get_db),
    _=Depends(verificar_admin),
):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="No encontrado")
    animal.estado = EstadoAnimalEnum.rechazado
    animal.motivo_rechazo = datos.motivo
    db.commit()
    db.refresh(animal)
    return animal


@app.get("/api/admin/animales/{animal_id}/ofertas", response_model=List[OfertaOut])
def listar_ofertas_admin(animal_id: str, db: Session = Depends(get_db), _=Depends(verificar_admin)):
    return db.query(Oferta).filter(Oferta.animal_id == animal_id).order_by(Oferta.monto_ofertado.desc()).all()


@app.post("/api/admin/animales/{animal_id}/cerrar-venta", response_model=AnimalAdminOut)
def cerrar_venta(
    animal_id: str,
    datos: CerrarVentaRequest,
    db: Session = Depends(get_db),
    _=Depends(verificar_admin),
):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal no encontrado")

    oferta = db.query(Oferta).filter(Oferta.id == datos.oferta_id, Oferta.animal_id == animal_id).first()
    if not oferta:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")

    pct = datos.comision_pct if datos.comision_pct is not None else oferta.comision_pct
    base_comparacion = animal.precio_piso or 0
    mejora = max(oferta.monto_ofertado - base_comparacion, 0)
    comision = round(mejora * (pct / 100), 2) if mejora > 0 else round(oferta.monto_ofertado * (pct / 100), 2)

    oferta.es_ganadora = True
    oferta.comision_pct = pct
    oferta.comision_monto = comision

    animal.estado = EstadoAnimalEnum.vendido
    animal.vendido_en = datetime.utcnow()

    db.commit()
    db.refresh(animal)
    return animal


@app.get("/api/admin/resumen")
def resumen_admin(db: Session = Depends(get_db), _=Depends(verificar_admin)):
    total_pendientes = db.query(Animal).filter(Animal.estado == EstadoAnimalEnum.pendiente).count()
    total_disponibles = db.query(Animal).filter(Animal.estado == EstadoAnimalEnum.disponible).count()
    total_negociacion = db.query(Animal).filter(Animal.estado == EstadoAnimalEnum.en_negociacion).count()
    total_vendidos = db.query(Animal).filter(Animal.estado == EstadoAnimalEnum.vendido).count()
    comision_total = db.query(func.sum(Oferta.comision_monto)).filter(Oferta.es_ganadora == True).scalar() or 0

    return {
        "pendientes": total_pendientes,
        "disponibles": total_disponibles,
        "en_negociacion": total_negociacion,
        "vendidos": total_vendidos,
        "comision_total_generada": comision_total,
    }
