import { Star } from 'lucide-react';

// Cinta de "Destacado" para las tarjetas de avisos pagados.
export default function SelloDestacado() {
  return (
    <span style={estilos.sello}>
      <Star size={12} fill="currentColor" /> Destacado
    </span>
  );
}

const estilos = {
  sello: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'var(--dorado)',
    color: 'var(--carbon)',
    fontSize: '11.5px',
    fontWeight: 700,
    letterSpacing: '0.02em',
    padding: '3px 9px',
    borderRadius: '999px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
    zIndex: 2,
  },
};
