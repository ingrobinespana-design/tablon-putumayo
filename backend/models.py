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


class EspecieEnum(str, enum.Enum):
    bovino = "bovino"      # reses, toretes, terneros, vacas, novillos
    bufalino = "bufalino"  # búfalos
    equino = "equino"      # caballos, yeguas, potros
    mular = "mular"        # mulas y machos
    asnal = "asnal"        # burros
    porcino = "porcino"    # cerdos, lechones
    ovino = "ovino"        # ovejas
    caprino = "caprino"    # cabras
    aves = "aves"          # gallinas, patos, pavos/bimbos y demás aves


class PropositoEnum(str, enum.Enum):
    carne = "carne"
    leche = "leche"
    doble_proposito = "doble_proposito"
    genetica = "genetica"            # cría / reproducción
    trabajo = "trabajo"              # carga, arriería, labores de finca
    silla_deporte = "silla_deporte"  # caballos finos, paso, deporte
    postura = "postura"              # aves ponedoras (huevos)


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

    # especie y proposito se guardan como texto (no como ENUM de Postgres) para
    # poder agregar nuevas especies/propósitos en el futuro sin migrar la base.
    # La validación de valores permitidos se hace en los esquemas (Pydantic).
    especie = Column(String(20), nullable=False, default=EspecieEnum.bovino.value)
    raza = Column(String(120), nullable=False)
    es_criollo = Column(Boolean, default=False)
    cantidad = Column(Integer, nullable=False, default=1)  # tamaño del lote (aves, lechones…)
    edad_meses = Column(Integer, nullable=True)
    peso_kg = Column(Float, nullable=True)
    proposito = Column(String(30), nullable=True)
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
