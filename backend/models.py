import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Column, String, Integer, Float, DateTime, Enum as SAEnum, ForeignKey, Text, Boolean
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from database import Base


def gen_uuid():
    return str(uuid.uuid4())


class PropositoEnum(str, enum.Enum):
    carne = "carne"
    genetica = "genetica"
    leche = "leche"
    doble_proposito = "doble_proposito"


class EstadoAnimalEnum(str, enum.Enum):
    pendiente = "pendiente"
    disponible = "disponible"
    en_negociacion = "en_negociacion"
    vendido = "vendido"
    rechazado = "rechazado"


class EstadoOfertaEnum(str, enum.Enum):
    activa = "activa"
    contraofertada = "contraofertada"
    aceptada = "aceptada"
    rechazada = "rechazada"
    ganadora = "ganadora"


class Animal(Base):
    __tablename__ = "animales"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)

    raza = Column(String(120), nullable=False)
    es_criollo = Column(Boolean, default=False)
    edad_meses = Column(Integer, nullable=True)
    peso_kg = Column(Float, nullable=True)
    proposito = Column(SAEnum(PropositoEnum), nullable=False, default=PropositoEnum.carne)
    descripcion = Column(Text, nullable=True)
    foto_url = Column(String(500), nullable=True)

    precio_piso = Column(Float, nullable=True)
    precio_esperado = Column(Float, nullable=True)

    propietario_nombre = Column(String(150), nullable=False)
    propietario_telefono = Column(String(30), nullable=False)
    zona = Column(String(150), nullable=True)

    estado = Column(SAEnum(EstadoAnimalEnum), nullable=False, default=EstadoAnimalEnum.pendiente)
    motivo_rechazo = Column(Text, nullable=True)

    creado_en = Column(DateTime, default=datetime.utcnow)
    aprobado_en = Column(DateTime, nullable=True)
    vendido_en = Column(DateTime, nullable=True)

    ofertas = relationship("Oferta", back_populates="animal", cascade="all, delete-orphan")


class Oferta(Base):
    __tablename__ = "ofertas"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    animal_id = Column(UUID(as_uuid=False), ForeignKey("animales.id"), nullable=False)

    comprador_nombre = Column(String(150), nullable=False)
    comprador_telefono = Column(String(30), nullable=True)
    monto_ofertado = Column(Float, nullable=False)
    nota = Column(Text, nullable=True)

    estado = Column(SAEnum(EstadoOfertaEnum), nullable=False, default=EstadoOfertaEnum.activa)

    monto_contraoferta = Column(Float, nullable=True)
    nota_contraoferta = Column(Text, nullable=True)
    contraoferta_en = Column(DateTime, nullable=True)

    es_ganadora = Column(Boolean, default=False)
    comision_pct = Column(Float, default=5.0)
    comision_monto = Column(Float, nullable=True)
    monto_final = Column(Float, nullable=True)

    creado_en = Column(DateTime, default=datetime.utcnow)

    animal = relationship("Animal", back_populates="ofertas")
