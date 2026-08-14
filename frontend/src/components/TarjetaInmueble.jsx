import { Link } from 'react-router-dom';
import { MapPin, Camera, BedDouble, Bath, Maximize } from 'lucide-react';
import { API_URL } from '../services/api';
import { LABEL_INMUEBLE_TIPO, LABEL_UNIDAD } from '../config/catalogo';

const ETIQUETAS_SELLO = {
  disponible: { texto: 'Disponible', clase: 'sello-disponible' },
  en_negociacion: { texto: 'En negociación', clase: 'sello-negociacion' },
  vendido: { texto: 'Vendido', clase: 'sello-vendido' },
};

function fmt(n) { return Number(n).toLocaleString('es-CO'); }

export default function TarjetaInmueble({ pub }) {
  const sello = ETIQUETAS_SELLO[pub.estado] || ETIQUETAS_SELLO.disponible;
  const a = pub.atributos || {};
  const fotoSrc = pub.foto_url
    ? (pub.foto_url.startsWith('http') ? pub.foto_url : `${API_URL}${pub.foto_url}`)
    : null;
  const nFotos = Array.isArray(pub.fotos) ? pub.fotos.length : (fotoSrc ? 1 : 0);
  const tipo = LABEL_INMUEBLE_TIPO[a.tipo] || 'Inmueble';

  return (
    <Link to={`/inmueble/${pub.id}`} style={estilos.tarjeta}>
      <div style={estilos.fotoContenedor}>
        {fotoSrc ? (
          <img src={fotoSrc} alt={pub.titulo} style={estilos.foto} />
        ) : (
          <div style={estilos.fotoPlaceholder}><span style={{ fontSize: '48px' }}>🏠</span></div>
        )}
        <span className={`sello ${sello.clase}`} style={estilos.selloFlotante}>{sello.texto}</span>
        <span style={estilos.selloTipo}>🏠 {tipo}</span>
        {nFotos > 1 && <span style={estilos.contadorFotos}><Camera size={12} /> {nFotos}</span>}
      </div>

      <div style={estilos.cuerpo}>
        <h3 style={estilos.titulo}>{pub.titulo}</h3>
        <div style={estilos.meta}>
          {a.area && <span><Maximize size={13} /> {fmt(a.area)} {LABEL_UNIDAD[a.unidad] || a.unidad}</span>}
          {a.habitaciones != null && a.habitaciones !== '' && <span><BedDouble size={13} /> {a.habitaciones}</span>}
          {a.banos != null && a.banos !== '' && <span><Bath size={13} /> {a.banos}</span>}
        </div>
        {pub.zona && <div style={estilos.zona}><MapPin size={14} /><span>{pub.zona}</span></div>}
        {pub.precio_esperado && (
          <div style={estilos.precio}>Precio: <strong>${fmt(pub.precio_esperado)}</strong></div>
        )}
      </div>
    </Link>
  );
}

const estilos = {
  tarjeta: { display: 'block', background: 'var(--crema-card)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--sombra)', border: '1px solid var(--linea)' },
  fotoContenedor: { position: 'relative', height: '180px', background: '#EDE6D3' },
  foto: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  fotoPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  selloFlotante: { position: 'absolute', top: '10px', right: '10px', background: 'var(--crema-card)' },
  selloTipo: { position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.62)', color: 'white', fontSize: '12px', fontWeight: 600, padding: '3px 9px', borderRadius: '999px' },
  contadorFotos: { position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.62)', color: 'white', fontSize: '12px', fontWeight: 600, padding: '3px 8px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '4px' },
  cuerpo: { padding: '16px' },
  titulo: { fontSize: '18px', marginBottom: '6px' },
  meta: { display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '13.5px', color: 'var(--carbon-suave)', marginBottom: '8px', alignItems: 'center' },
  zona: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--carbon-suave)', marginBottom: '8px' },
  precio: { fontSize: '14px', color: 'var(--carbon)', paddingTop: '8px', borderTop: '1px solid var(--linea)' },
};
