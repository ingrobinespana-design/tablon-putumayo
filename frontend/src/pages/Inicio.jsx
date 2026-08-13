import { Link } from 'react-router-dom';
import { CATEGORIAS } from '../config/catalogo';

const RUTA_CATALOGO = {
  animales: '/animales',
  vehiculos: '/vehiculos',
  inmuebles: '/inmuebles',
  electrodomesticos: '/electrodomesticos',
};

export default function Inicio({ modo = 'ver' }) {
  const publicando = modo === 'publicar';

  function rutaDe(cat) {
    if (!cat.activa) return null;
    return publicando ? `/publicar/${cat.valor}` : RUTA_CATALOGO[cat.valor] || '/';
  }

  return (
    <div className="contenedor" style={{ padding: '36px 20px 60px' }}>
      <div style={estilos.hero}>
        <h1 style={estilos.titulo}>
          {publicando ? '¿Qué quieres publicar?' : 'Compra y venta en el Putumayo'}
        </h1>
        <p style={estilos.sub}>
          {publicando
            ? 'Elige la categoría de lo que vas a vender.'
            : 'Elige una categoría para ver lo que hay disponible cerca de ti.'}
        </p>
      </div>

      <div className="catalogo-grid">
        {CATEGORIAS.map((cat) => {
          const ruta = rutaDe(cat);
          const contenido = (
            <>
              <span style={estilos.emoji}>{cat.emoji}</span>
              <span style={estilos.nombre}>{cat.label}</span>
              <span style={estilos.desc}>{cat.desc}</span>
              {!cat.activa && <span style={estilos.pronto}>Próximamente</span>}
            </>
          );
          return ruta ? (
            <Link key={cat.valor} to={ruta} style={{ ...estilos.tarjeta, ...estilos.activa }}>
              {contenido}
            </Link>
          ) : (
            <div key={cat.valor} style={{ ...estilos.tarjeta, ...estilos.inactiva }}>
              {contenido}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const estilos = {
  hero: { maxWidth: '640px', marginBottom: '28px' },
  titulo: { fontSize: 'clamp(28px, 4vw, 38px)', marginBottom: '10px' },
  sub: { color: 'var(--carbon-suave)', fontSize: '15.5px', lineHeight: 1.6 },
  tarjeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '6px',
    padding: '28px 18px',
    background: 'var(--crema-card)',
    border: '1px solid var(--linea)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--sombra)',
    position: 'relative',
  },
  activa: { cursor: 'pointer' },
  inactiva: { opacity: 0.6 },
  emoji: { fontSize: '46px', lineHeight: 1 },
  nombre: { fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--verde-pasto-oscuro)' },
  desc: { fontSize: '13px', color: 'var(--carbon-suave)' },
  pronto: {
    marginTop: '6px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--terracota)',
    background: 'rgba(168, 91, 63, 0.1)',
    padding: '3px 10px',
    borderRadius: '999px',
  },
};
