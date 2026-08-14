import { Share2 } from 'lucide-react';

// Botón que abre WhatsApp con el aviso y su enlace, listo para reenviar.
// Funciona para cualquier categoría (animal, vehículo, inmueble).
export default function BotonCompartir({ titulo, precio, ruta, estilo }) {
  const url = `${window.location.origin}${ruta}`;
  const precioTxt = precio ? ` — $${Number(precio).toLocaleString('es-CO')}` : '';
  const texto = `${titulo}${precioTxt}\n\nMíralo en Vende Putumayo 👇\n${url}`;
  const enlace = `https://wa.me/?text=${encodeURIComponent(texto)}`;

  return (
    <a
      href={enlace}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-secundario"
      style={{ gap: '8px', ...estilo }}
    >
      <Share2 size={17} /> Compartir por WhatsApp
    </a>
  );
}
