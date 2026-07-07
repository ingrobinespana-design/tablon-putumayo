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
    pendiente = "pendiente"       # esperando aprobación del admin
    disponible = "disponible"     # aprobado, visible públicamente
    en_negociacion = "en_negociacion"
    vendido = "vendido"
    rechazado = "rechazado"       # no pasó la revisión


class Animal(Base):
    __tablename__ = "animales"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)

    # Datos del animal
    raza = Column(String(120), nullable=False)
    es_criollo = Column(Boolean, default=False)  # True si no tiene raza definida
    edad_meses = Column(Integer, nullable=True)
    peso_kg = Column(Float, nullable=True)
    proposito = Column(SAEnum(PropositoEnum), nullable=False, default=PropositoEnum.carne)
    descripcion = Column(Text, nullable=True)
    foto_url = Column(String(500), nullable=True)

    # Precio
    precio_piso = Column(Float, nullable=True)  # lo que pagaría la pesa local, referencia
    precio_esperado = Column(Float, nullable=True)  # lo que el dueño espera obtener

    # Propietario (sin necesidad de cuenta de usuario)
    propietario_nombre = Column(String(150), nullable=False)
    propietario_telefono = Column(String(30), nullable=False)
    zona = Column(String(150), nullable=True)  # vereda/municipio

    # Moderación y estado
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

    # Si la venta se concretó con esta oferta
    es_ganadora = Column(Boolean, default=False)
    comision_pct = Column(Float, default=5.0)  # % de comisión sobre la mejora de precio
    comision_monto = Column(Float, nullable=True)  # calculado cuando se cierra

    creado_en = Column(DateTime, default=datetime.utcnow)

    animal = relationship("Animal", back_populates="ofertas")
