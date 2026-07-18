import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../services/api';
import TarjetaAnimal from '../components/TarjetaAnimal';

export default function Catalogo() {
  const [animales, setAnimales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [despertando, setDespertando] = useState(false);
  const [error, setError] = useState(null);
  const [filtroProposito, setFiltroProposito] = useState('');
  const [filtroZona, setFiltroZona] = useState('');

  async function cargar() {
    setCargando(true);
    setDespertando(false);
    setError(null);
    // Si tarda más de 8s es porque el servidor gratuito estaba dormido
    // y está arrancando (~1 min); avisamos para que el visitante espere.
    const avisoDespertar = setTimeout(() => setDespertando(true), 8000);
    try {
      const datos = await api.listarAnimales({
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
          value={filtroProposito}
          onChange={(e) => setFiltroProposito(e.target.value)}
          style={estilos.select}
        >
          <option value="">Todos los propósitos</option>
          <option value="carne">Para carne</option>
          <option value="genetica">Genética / cría</option>
          <option value="leche">Leche</option>
          <option value="doble_proposito">Doble propósito</option>
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
        <div style={estilos.grid}>
          {animales.map((animal) => (
            <TarjetaAnimal key={animal.id} animal={animal} />
          ))}
        </div>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
  },
};
