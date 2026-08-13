import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../services/api';
import TarjetaAnimal from '../components/TarjetaAnimal';
import { ESPECIES, PROPOSITOS } from '../config/catalogo';

export default function Catalogo() {
  const POR_PAGINA = 12;
  const [animales, setAnimales] = useState([]);
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const [cargando, setCargando] = useState(true);
  const [despertando, setDespertando] = useState(false);
  const [error, setError] = useState(null);
  const [filtroEspecie, setFiltroEspecie] = useState('');
  const [filtroProposito, setFiltroProposito] = useState('');
  const [filtroZona, setFiltroZona] = useState('');

  async function cargar() {
    setCargando(true);
    setDespertando(false);
    setError(null);
    setVisibles(POR_PAGINA);
    // Si tarda más de 8s es porque el servidor gratuito estaba dormido
    // y está arrancando (~1 min); avisamos para que el visitante espere.
    const avisoDespertar = setTimeout(() => setDespertando(true), 8000);
    try {
      const datos = await api.listarAnimales({
        especie: filtroEspecie || undefined,
        proposito: filtroProposito || undefined,
        zona: filtroZona || undefined,
      });
      setAnimales(datos);
    } catch (e) {
      setError('No pudimos cargar el catálogo. Intenta de nuevo en un momento.');
    } finally {
      clearTimeout(avisoDespertar);
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

  return (
    <div className="contenedor" style={{ padding: '32px 20px 60px' }}>
      <div style={estilos.hero}>
        <h1 style={estilos.heroTitulo}>Animales disponibles</h1>
        <p style={estilos.heroTexto}>
          Cada animal aquí fue revisado antes de publicarse. Si te interesa uno,
          escribe directo por WhatsApp al propietario.
        </p>
      </div>

      <form onSubmit={manejarBuscar} style={estilos.filtros}>
        <select
          value={filtroEspecie}
          onChange={(e) => setFiltroEspecie(e.target.value)}
          style={estilos.select}
        >
          <option value="">Todas las especies</option>
          {ESPECIES.map((e) => (
            <option key={e.valor} value={e.valor}>
              {e.emoji} {e.label}
            </option>
          ))}
        </select>
        <select
          value={filtroProposito}
          onChange={(e) => setFiltroProposito(e.target.value)}
          style={estilos.select}
        >
          <option value="">Todos los propósitos</option>
          {PROPOSITOS.map((p) => (
            <option key={p.valor} value={p.valor}>
              {p.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Vereda o municipio"
          value={filtroZona}
          onChange={(e) => setFiltroZona(e.target.value)}
          style={estilos.input}
        />
        <button type="submit" className="btn btn-primario">
          <Search size={16} /> Buscar
        </button>
      </form>

      {cargando && (
        <p style={estilos.mensaje}>
          {despertando
            ? 'El servidor está despertando, esto puede tardar hasta un minuto. No cierres la página…'
            : 'Cargando animales…'}
        </p>
      )}
      {error && <p style={{ ...estilos.mensaje, color: 'var(--rojo-alerta)' }}>{error}</p>}

      {!cargando && !error && animales.length === 0 && (
        <div style={estilos.vacio}>
          <h3 style={estilos.vacioTitulo}>Todavía no hay animales publicados aquí</h3>
          <p>Sé el primero — publica un animal y empieza a recibir ofertas.</p>
        </div>
      )}

      {!cargando && animales.length > 0 && (
        <>
          <div className="catalogo-grid">
            {animales.slice(0, visibles).map((animal) => (
              <TarjetaAnimal key={animal.id} animal={animal} />
            ))}
          </div>

          {visibles < animales.length && (
            <div style={estilos.verMasCaja}>
              <button
                className="btn btn-secundario"
                onClick={() => setVisibles((v) => v + POR_PAGINA)}
              >
                Ver más animales ({animales.length - visibles} restantes)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const estilos = {
  hero: {
    marginBottom: '28px',
    maxWidth: '640px',
  },
  heroTitulo: {
    fontSize: 'clamp(28px, 4vw, 38px)',
    marginBottom: '10px',
  },
  heroTexto: {
    color: 'var(--carbon-suave)',
    fontSize: '15.5px',
    lineHeight: 1.6,
  },
  filtros: {
    display: 'flex',
    gap: '10px',
    marginBottom: '28px',
    flexWrap: 'wrap',
  },
  select: {
    padding: '10px 14px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--linea)',
    background: 'var(--crema-card)',
    minWidth: '180px',
  },
  input: {
    padding: '10px 14px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--linea)',
    background: 'var(--crema-card)',
    flex: '1',
    minWidth: '180px',
  },
  mensaje: {
    color: 'var(--carbon-suave)',
    padding: '20px 0',
  },
  vacio: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'var(--crema-card)',
    borderRadius: 'var(--radius)',
    border: '1px dashed var(--linea)',
    color: 'var(--carbon-suave)',
  },
  vacioTitulo: {
    fontSize: '20px',
    marginBottom: '8px',
    color: 'var(--verde-pasto-oscuro)',
  },
  verMasCaja: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '28px',
  },
};
