from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator
import re

from models import EspecieEnum, PropositoEnum, EstadoAnimalEnum, EstadoOfertaEnum


# ---------- Animal ----------

class AnimalCreate(BaseModel):
    # use_enum_values: guarda el string ("bovino") y no el objeto enum,
    # así queda limpio en la base de datos (columna de texto).
    model_config = ConfigDict(use_enum_values=True)

    especie: EspecieEnum
    raza: str = Field(..., min_length=2, max_length=120)
    es_criollo: bool = False
    cantidad: int = Field(1, ge=1, le=100000)
    edad_meses: Optional[int] = Field(None, ge=0, le=600)
    peso_kg: Optional[float] = Field(None, ge=0, le=2000)
    proposito: Optional[PropositoEnum] = None
    descripcion: Optional[str] = Field(None, max_length=1000)

    precio_piso: Optional[float] = Field(None, ge=0)
    precio_esperado: Optional[float] = Field(None, ge=0)

    propietario_nombre: str = Field(..., min_length=3, max_length=150)
    propietario_telefono: str = Field(..., min_length=7, max_length=30)
    zona: Optional[str] = Field(None, max_length=150)

    @field_validator("propietario_telefono")
    @classmethod
    def validar_telefono(cls, v: str) -> str:
        digitos = re.sub(r"\D", "", v)
        if len(digitos) < 7:
            raise ValueError("Número de teléfono inválido")
        return v

    @field_validator("raza", "propietario_nombre", "descripcion")
    @classmethod
    def sin_links_ni_basura(cls, v):
        if v is None:
            return v
        bloqueados = ["http://", "https://", "www.", "<script"]
        v_lower = v.lower()
        if any(b in v_lower for b in bloqueados):
            raise ValueError("El texto contiene contenido no permitido")
        return v.strip()


class AnimalOut(BaseModel):
    id: str
    categoria: str
    titulo: Optional[str] = None
    atributos: Optional[dict] = None
    # Campos de animales (nulos en otras categorías)
    especie: Optional[str] = None
    raza: Optional[str] = None
    es_criollo: bool = False
    cantidad: int = 1
    edad_meses: Optional[int] = None
    peso_kg: Optional[float] = None
    proposito: Optional[str] = None
    # Compartidos
    descripcion: Optional[str] = None
    foto_url: Optional[str] = None
    fotos: Optional[list] = None
    precio_piso: Optional[float] = None
    precio_esperado: Optional[float] = None
    propietario_nombre: str
    propietario_telefono: str
    zona: Optional[str] = None
    estado: EstadoAnimalEnum
    creado_en: datetime

    class Config:
        from_attributes = True


class PublicacionCreate(BaseModel):
    """Crear una publicación de categoría no-animal (vehículos, inmuebles…)."""
    categoria: str = Field(..., min_length=2, max_length=20)
    titulo: str = Field(..., min_length=3, max_length=150)
    atributos: dict = Field(default_factory=dict)
    descripcion: Optional[str] = Field(None, max_length=1000)
    precio_esperado: Optional[float] = Field(None, ge=0)
    propietario_nombre: str = Field(..., min_length=3, max_length=150)
    propietario_telefono: str = Field(..., min_length=7, max_length=30)
    zona: Optional[str] = Field(None, max_length=150)

    @field_validator("propietario_telefono")
    @classmethod
    def validar_telefono(cls, v: str) -> str:
        if len(re.sub(r"\D", "", v)) < 7:
            raise ValueError("Número de teléfono inválido")
        return v

    @field_validator("titulo", "propietario_nombre", "descripcion")
    @classmethod
    def sin_links_ni_basura(cls, v):
        if v is None:
            return v
        bloqueados = ["http://", "https://", "www.", "<script"]
        if any(b in v.lower() for b in bloqueados):
            raise ValueError("El texto contiene contenido no permitido")
        return v.strip()


class AnimalAdminOut(AnimalOut):
    motivo_rechazo: Optional[str]
    aprobado_en: Optional[datetime]
    vendido_en: Optional[datetime]


class AnimalRechazar(BaseModel):
    motivo: str = Field(..., min_length=3, max_length=300)


# ---------- Oferta ----------

class OfertaCreate(BaseModel):
    comprador_nombre: str = Field(..., min_length=3, max_length=150)
    comprador_telefono: Optional[str] = Field(None, max_length=30)
    monto_ofertado: float = Field(..., gt=0)
    nota: Optional[str] = Field(None, max_length=500)


class OfertaOut(BaseModel):
    id: str
    animal_id: str
    comprador_nombre: str
    comprador_telefono: Optional[str]
    monto_ofertado: float
    nota: Optional[str]
    estado: EstadoOfertaEnum
    monto_contraoferta: Optional[float]
    nota_contraoferta: Optional[str]
    contraoferta_en: Optional[datetime]
    es_ganadora: bool
    comision_pct: float
    comision_monto: Optional[float]
    monto_final: Optional[float]
    creado_en: datetime

    class Config:
        from_attributes = True


class ContraofertaCreate(BaseModel):
    monto_contraoferta: float = Field(..., gt=0)
    nota_contraoferta: Optional[str] = Field(None, max_length=500)


class CerrarVentaRequest(BaseModel):
    oferta_id: str
    comision_pct: Optional[float] = Field(None, ge=0, le=50)
    usar_contraoferta: bool = False


# ---------- Admin auth ----------

class AdminLogin(BaseModel):
    clave: str
