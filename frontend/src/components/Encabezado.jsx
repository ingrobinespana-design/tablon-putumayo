import { Link, useLocation } from 'react-router-dom';

export default function Encabezado() {
  const location = useLocation();

  return (
    <header style={estilos.header}>
      <div className="contenedor" style={estilos.contenido}>
        <Link to="/" style={estilos.marca}>
          <span style={estilos.marcaIcono}>⛓</span>
          <div>
            <div style={estilos.marcaTexto}>Vende Putumayo</div>
            <div style={estilos.marcaSub}>compra y venta en el Putumayo</div>
          </div>
        </Link>
        <nav style={estilos.nav}>
          <Link
            to="/"
            style={{
              ...estilos.link,
              ...(location.pathname === '/' ? estilos.linkActivo : {}),
            }}
          >
            Inicio
          </Link>
          <Link
            to="/publicar"
            style={{
              ...estilos.link,
              ...(location.pathname.startsWith('/publicar') ? estilos.linkActivo : {}),
            }}
          >
            Publicar
          </Link>
        </nav>
      </div>
    </header>
  );
}

const estilos = {
  header: {
    background: 'var(--verde-pasto-oscuro)',
    borderBottom: '3px solid var(--dorado)',
  },
  contenido: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  marca: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  marcaIcono: {
    fontSize: '28px',
    color: 'var(--dorado)',
  },
  marcaTexto: {
    fontFamily: 'var(--font-display)',
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--crema-card)',
    lineHeight: 1.1,
  },
  marcaSub: {
    fontSize: '12px',
    color: 'var(--linea)',
    letterSpacing: '0.03em',
  },
  nav: {
    display: 'flex',
    gap: '8px',
  },
  link: {
    padding: '8px 16px',
    borderRadius: '4px',
    color: 'var(--crema)',
    fontWeight: 600,
    fontSize: '14.5px',
    transition: 'background 0.15s ease',
  },
  linkActivo: {
    background: 'var(--terracota)',
    color: 'white',
  },
};
