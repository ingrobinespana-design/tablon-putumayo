import { useState } from 'react';
import { Copy, Link2 } from 'lucide-react';

// Muestra el enlace privado con el que el vendedor administra su aviso
// (reportar la venta más adelante). Se muestra al terminar de publicar.
export default function EnlaceGestion({ token }) {
  const [copiado, setCopiado] = useState(false);
  if (!token) return null;
  const url = `${window.location.origin}/gestionar/${token}`;

  function copiar() {
    navigator.clipboard?.writeText(url).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  return (
    <div style={estilos.caja}>
      <p style={estilos.titulo}><Link2 size={15} /> Guarda tu enlace para administrar el aviso</p>
      <p style={estilos.nota}>Con él podrás reportar la venta cuando la concretes. Guárdalo o cópialo.</p>
      <div style={estilos.fila}>
        <span style={estilos.url}>{url}</span>
        <button type="button" className="btn btn-secundario" style={{ padding: '8px 12px', whiteSpace: 'nowrap' }} onClick={copiar}>
          <Copy size={15} /> {copiado ? 'Copiado' : 'Copiar'}
        </button>
      </div>
    </div>
  );
}

const estilos = {
  caja: { background: 'rgba(201, 162, 75, 0.1)', border: '1px solid var(--dorado)', borderRadius: 'var(--radius)', padding: '16px', textAlign: 'left', marginBottom: '20px' },
  titulo: { fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 4px' },
  nota: { fontSize: '13px', color: 'var(--carbon-suave)', margin: '0 0 10px', lineHeight: 1.5 },
  fila: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  url: { fontSize: '12.5px', color: 'var(--carbon)', wordBreak: 'break-all', flex: 1, minWidth: '180px' },
};
