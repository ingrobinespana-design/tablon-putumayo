import { Link } from 'react-router-dom';
import { MapPin, ImageOff } from 'lucide-react';
import { API_URL } from '../services/api';
import { ETIQUETA_ESPECIE, ETIQUETA_PROPOSITO } from '../config/catalogo';

const ETIQUETAS_SELLO = {
  disponible: { texto: 'Disponible', clase: 'sello-disponible' },
  en_negociacion: { texto: 'En negociación', clase: 'sello-negociacion' },
  vendido: { texto: 'Vendido', clase: 'sello-vendido' },
};

export default function TarjetaAnimal({ animal }) {
  const sello = ETIQUETAS_SELLO[animal.estado] || ETIQUETAS_SELLO.disponible;
  const fotoSrc = animal.foto_url
    ? (animal.foto_url.startsWith('http') ? animal.foto_url : `${API_URL}${animal.foto_url}`)
    : null;
  const etiquetaEspecie = ETIQUETA_ESPECIE[animal.especie] || animal.especie;
  const esLote = animal.cantidad > 1;

  return (
    <Link to={`/animal/${animal.id}`} style={estilos.tarjeta}>
      <div style={estilos.fotoContenedor}>
        {fotoSrc ? (
          <img src={fotoSrc} alt={animal.raza} style={estilos.foto} />
        ) : (
          <div style={estilos.fotoPlaceholder}>
            <ImageOff size={30} color="var(--linea)" />
            <span style={estilos.sinFoto}>Sin foto</span>
          </div>
        )}
        <span className={`sello ${sello.clase}`} style={estilos.selloFlotante}>
          {sello.texto}
        </span>
        <span style={estilos.selloEspecie}>{etiquetaEspecie}</span>
      </div>

      <div style={estilos.cuerpo}>
        <h3 style={estilos.titulo}>
          {esLote && <span style={estilos.lote}>Lote de {animal.cantidad} · </span>}
          {animal.raza}
        </h3>
        <div style={estilos.meta}>
          {animal.edad_meses != null && <span>{animal.edad_meses} meses</span>}
          {animal.peso_kg != null && <span>· {animal.peso_kg} kg</span>}
        </div>

        {animal.proposito && (
          <div style={estilos.proposito}>
            {ETIQUETA_PROPOSITO[animal.proposito] || animal.proposito}
          </div>
        )}

        {animal.zona && (
          <div style={estilos.zona}>
            <MapPin size={14} />
            <span>{animal.zona}</span>
          </div>
        )}

        {animal.precio_esperado && (
          <div style={estilos.precio}>
            Precio esperado: <strong>${animal.precio_esperado.toLocaleString('es-CO')}</strong>
          </div>
        )}
      </div>
    </Link>
  );
}

const estilos = {
  tarjeta: {
    display: 'block',
    background: 'var(--crema-card)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    boxShadow: 'var(--sombra)',
    border: '1px solid var(--linea)',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  },
  fotoContenedor: {
    position: 'relative',
    height: '180px',
    background: '#EDE6D3',
  },
  foto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  fotoPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  },
  sinFoto: {
    fontSize: '11.5px',
    color: 'var(--carbon-suave)',
    letterSpacing: '0.03em',
  },
  selloFlotante: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'var(--crema-card)',
  },
  selloEspecie: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    background: 'rgba(0, 0, 0, 0.62)',
    color: 'white',
    fontSize: '12px',
    fontWeight: 600,
    padding: '3px 9px',
    borderRadius: '999px',
  },
  cuerpo: {
    padding: '16px',
  },
  titulo: {
    fontSize: '19px',
    marginBottom: '4px',
  },
  lote: {
    color: 'var(--terracota)',
    fontWeight: 700,
  },
  meta: {
    fontSize: '13.5px',
    color: 'var(--carbon-suave)',
    marginBottom: '8px',
  },
  proposito: {
    display: 'inline-block',
    fontSize: '12.5px',
    fontWeight: 600,
    color: 'var(--terracota)',
    marginBottom: '10px',
  },
  zona: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '13px',
    color: 'var(--carbon-suave)',
    marginBottom: '8px',
  },
  precio: {
    fontSize: '14px',
    color: 'var(--carbon)',
    paddingTop: '8px',
    borderTop: '1px solid var(--linea)',
  },
};
