from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator
import re

from models import PropositoEnum, EstadoAnimalEnum, EstadoOfertaEnum


# ---------- Animal ----------

class AnimalCreate(BaseModel):
    raza: str = Field(..., min_length=2, max_length=120)
    es_criollo: bool = False
    edad_meses: Optional[int] = Field(None, ge=0, le=300)
    peso_kg: Optional[float] = Field(None, ge=0, le=2000)
    proposito: PropositoEnum = PropositoEnum.carne
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
    raza: str
    es_criollo: bool
    edad_meses: Optional[int]
    peso_kg: Optional[float]
    proposito: PropositoEnum
    descripcion: Optional[str]
    foto_url: Optional[str]
    precio_piso: Optional[float]
    precio_esperado: Optional[float]
    propietario_nombre: str
    propietario_telefono: str
    zona: Optional[str]
    estado: EstadoAnimalEnum
    creado_en: datetime

    class Config:
        from_attributes = True


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
