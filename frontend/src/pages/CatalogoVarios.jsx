import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { api } from '../services/api';
import TarjetaVarios from '../components/TarjetaVarios';
import { VARIOS_GRUPOS } from '../config/catalogo';

export default function CatalogoVarios() {
  const POR_PAGINA = 12;
  const [pubs, setPubs] = useState([]);
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const [cargando, setCargando] = useState(true);
  const [despertando, setDespertando] = useState(false);
  const [error, setError] = useState(null);
  const [filtroGrupo, setFiltroGrupo] = useState('');
  const [filtroZona, setFiltroZona] = useState('');

  async function cargar() {
    setCargando(true);
    setDespertando(false);
    setError(null);
    setVisibles(POR_PAGINA);
    const aviso = setTimeout(() => setDespertando(true), 8000);
    try {
      const datos = await api.listarPublicaciones('varios', { zona: filtroZona || undefined });
      setPubs(datos);
    } catch (e) {
      setError('No pudimos cargar los avisos. Intenta de nuevo en un momento.');
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

  function manejarBuscar(e) { e.preventDefault(); cargar(); }

  const filtrados = filtroGrupo
    ? pubs.filter((p) => (p.atributos || {}).grupo === filtroGrupo)
    : pubs;

  return (
    <div className="contenedor" style={{ padding: '32px 20px 60px' }}>
      <div style={estilos.encabezado}>
        <div>
          <h1 style={estilos.h1}>Otros / Varios</h1>
          <p style={estilos.sub}>Negocios, muebles, herramientas y todo lo que no entra en las otras categorías.</p>
        </div>
        <Link to="/publicar/varios" className="btn btn-primario">
          <Plus size={16} /> Publicar
        </Link>
      </div>

      <form onSubmit={manejarBuscar} style={estilos.filtros}>
        <select value={filtroGrupo} onChange={(e) => setFiltroGrupo(e.target.value)} style={estilos.select}>
          <option value="">Todo</option>
          {VARIOS_GRUPOS.map((g) => (<option key={g.valor} value={g.valor}>{g.label}</option>))}
        </select>
        <input type="text" placeholder="Vereda o municipio" value={filtroZona}
          onChange={(e) => setFiltroZona(e.target.value)} style={estilos.input} />
        <button type="submit" className="btn btn-primario"><Search size={16} /> Buscar</button>
      </form>

      {cargando && (
        <p style={estilos.mensaje}>
          {despertando
            ? 'El servidor está despertando, esto puede tardar hasta un minuto. No cierres la página…'
            : 'Cargando avisos…'}
        </p>
      )}
      {error && <p style={{ ...estilos.mensaje, color: 'var(--rojo-alerta)' }}>{error}</p>}

      {!cargando && !error && filtrados.length === 0 && (
        <div style={estilos.vacio}>
          <h3 style={estilos.vacioTitulo}>Todavía no hay avisos publicados aquí</h3>
          <p>Sé el primero — publica lo que quieras vender y empieza a recibir ofertas.</p>
        </div>
      )}

      {!cargando && filtrados.length > 0 && (
        <>
          <div className="catalogo-grid">
            {filtrados.slice(0, visibles).map((pub) => (<TarjetaVarios key={pub.id} pub={pub} />))}
          </div>
          {visibles < filtrados.length && (
            <div style={estilos.verMasCaja}>
              <button className="btn btn-secundario" onClick={() => setVisibles((v) => v + POR_PAGINA)}>
                Ver más ({filtrados.length - visibles} restantes)
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
  sub: { color: 'var(--carbon-suave)', fontSize: '15px', maxWidth: '520px' },
  filtros: { display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' },
  select: { padding: '10px 14px', borderRadius: 'var(--radius)', border: '1.5px solid var(--linea)', background: 'var(--crema-card)', minWidth: '180px' },
  input: { padding: '10px 14px', borderRadius: 'var(--radius)', border: '1.5px solid var(--linea)', background: 'var(--crema-card)', flex: 1, minWidth: '180px' },
  mensaje: { color: 'var(--carbon-suave)', padding: '20px 0' },
  vacio: { textAlign: 'center', padding: '60px 20px', background: 'var(--crema-card)', borderRadius: 'var(--radius)', border: '1px dashed var(--linea)', color: 'var(--carbon-suave)' },
  vacioTitulo: { fontSize: '20px', marginBottom: '8px', color: 'var(--verde-pasto-oscuro)' },
  verMasCaja: { display: 'flex', justifyContent: 'center', marginTop: '28px' },
};
