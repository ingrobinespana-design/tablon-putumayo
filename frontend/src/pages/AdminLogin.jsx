import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { api } from '../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [clave, setClave] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  async function manejarEnviar(e) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await api.adminLogin(clave);
      sessionStorage.setItem('admin_clave', clave);
      navigate('/admin/panel');
    } catch (e) {
      setError(e.message || 'Clave incorrecta');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="contenedor" style={{ padding: '80px 20px', maxWidth: '420px' }}>
      <div style={estilos.box}>
        <Lock size={28} color="var(--verde-pasto)" />
        <h2 style={{ marginTop: '12px', marginBottom: '4px' }}>Acceso administrador</h2>
        <p style={estilos.subtitulo}>Solo para gestionar publicaciones y ofertas.</p>

        <form onSubmit={manejarEnviar} style={estilos.form}>
          <input
            type="password"
            placeholder="Clave de administrador"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            style={estilos.input}
            autoFocus
          />
          {error && <p style={estilos.error}>{error}</p>}
          <button type="submit" className="btn btn-primario" disabled={cargando}>
            {cargando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const estilos = {
  box: {
    background: 'var(--crema-card)',
    border: '1px solid var(--linea)',
    borderRadius: 'var(--radius)',
    padding: '32px',
  },
  subtitulo: {
    color: 'var(--carbon-suave)',
    fontSize: '14px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '12px 14px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--linea)',
  },
  error: {
    color: 'var(--rojo-alerta)',
    fontSize: '13.5px',
  },
};
