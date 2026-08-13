import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { api } from '../services/api';
import TarjetaVehiculo from '../components/TarjetaVehiculo';
import { VEHICULO_TIPOS } from '../config/catalogo';

export default function CatalogoVehiculos() {
  const POR_PAGINA = 12;
  const [pubs, setPubs] = useState([]);
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const [cargando, setCargando] = useState(true);
  const [despertando, setDespertando] = useState(false);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroZona, setFiltroZona] = useState('');

  async function cargar() {
    setCargando(true);
    setDespertando(false);
    setError(null);
    setVisibles(POR_PAGINA);
    const aviso = setTimeout(() => setDespertando(true), 8000);
    try {
      const datos = await api.listarPublicaciones('vehiculos', { zona: filtroZona || undefined });
      setPubs(datos);
    } catch (e) {
      setError('No pudimos cargar los vehículos. Intenta de nuevo en un momento.');
    } finally {
      clearTimeout(aviso);
      setDespertando(false);
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function manejarBuscar(e) {
    e.preventDefault();
    cargar();
  }

  // El filtro por tipo se aplica en el cliente (el backend filtra por categoría/zona).
  const filtrados = filtroTipo
    ? pubs.filter((p) => (p.atributos || {}).tipo === filtroTipo)
    : pubs;

  return (
    <div className="contenedor" style={{ padding: '32px 20px 60px' }}>
      <div style={estilos.encabezado}>
        <div>
          <h1 style={estilos.h1}>Vehículos</h1>
          <p style={estilos.sub}>Carros, motos, camionetas, tractores y más en el Putumayo.</p>
        </div>
        <Link to="/publicar/vehiculos" className="btn btn-primario">
          <Plus size={16} /> Publicar vehículo
        </Link>
      </div>

      <form onSubmit={manejarBuscar} style={estilos.filtros}>
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} style={estilos.select}>
          <option value="">Todos los tipos</option>
          {VEHICULO_TIPOS.map((t) => (
            <option key={t.valor} value={t.valor}>{t.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Vereda o municipio"
          value={filtroZona}
          onChange={(e) => setFiltroZona(e.target.value)}
          style={estilos.input}
        />
        <button type="submit" className="btn btn-primario"><Search size={16} /> Buscar</button>
      </form>

      {cargando && (
        <p style={estilos.mensaje}>
          {despertando
            ? 'El servidor está despertando, esto puede tardar hasta un minuto. No cierres la página…'
            : 'Cargando vehículos…'}
        </p>
      )}
      {error && <p style={{ ...estilos.mensaje, color: 'var(--rojo-alerta)' }}>{error}</p>}

      {!cargando && !error && filtrados.length === 0 && (
        <div style={estilos.vacio}>
          <h3 style={estilos.vacioTitulo}>Todavía no hay vehículos publicados aquí</h3>
          <p>Sé el primero — publica tu vehículo y empieza a recibir ofertas.</p>
        </div>
      )}

      {!cargando && filtrados.length > 0 && (
        <>
          <div className="catalogo-grid">
            {filtrados.slice(0, visibles).map((pub) => (
              <TarjetaVehiculo key={pub.id} pub={pub} />
            ))}
          </div>
          {visibles < filtrados.length && (
            <div style={estilos.verMasCaja}>
              <button className="btn btn-secundario" onClick={() => setVisibles((v) => v + POR_PAGINA)}>
                Ver más vehículos ({filtrados.length - visibles} restantes)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const estilos = {
  encabezado: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' },
  h1: { fontSize: 'clamp(28px, 4vw, 38px)', marginBottom: '6px' },
  sub: { color: 'var(--carbon-suave)', fontSize: '15px' },
  filtros: { display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' },
  select: { padding: '10px 14px', borderRadius: 'var(--radius)', border: '1.5px solid var(--linea)', background: 'var(--crema-card)', minWidth: '180px' },
  input: { padding: '10px 14px', borderRadius: 'var(--radius)', border: '1.5px solid var(--linea)', background: 'var(--crema-card)', flex: 1, minWidth: '180px' },
  mensaje: { color: 'var(--carbon-suave)', padding: '20px 0' },
  vacio: { textAlign: 'center', padding: '60px 20px', background: 'var(--crema-card)', borderRadius: 'var(--radius)', border: '1px dashed var(--linea)', color: 'var(--carbon-suave)' },
  vacioTitulo: { fontSize: '20px', marginBottom: '8px', color: 'var(--verde-pasto-oscuro)' },
  verMasCaja: { display: 'flex', justifyContent: 'center', marginTop: '28px' },
};
