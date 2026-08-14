import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { ESPECIES, PROPOSITOS, PLACEHOLDER_RAZA } from '../config/catalogo';
import { comprimirImagen } from '../utils/imagen';
import EnlaceGestion from '../components/EnlaceGestion';
import CampoPrecio from '../components/CampoPrecio';

export default function PublicarAnimal() {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [publicado, setPublicado] = useState(false);
  const [token, setToken] = useState(null);

  const [form, setForm] = useState({
    especie: 'bovino',
    raza: '',
    es_criollo: false,
    cantidad: '',
    edad_meses: '',
    peso_kg: '',
    proposito: '',
    descripcion: '',
    precio_esperado: '',
    propietario_nombre: '',
    propietario_telefono: '',
    zona: '',
  });
  const esLote = form.especie === 'aves' || form.especie === 'porcino';
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  function actualizar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function manejarFoto(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const optimizada = await comprimirImagen(archivo);
    setFoto(optimizada);
    setFotoPreview(URL.createObjectURL(optimizada));
  }

  async function manejarEnviar(e) {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const fd = new FormData();
      fd.append('especie', form.especie);
      fd.append('raza', form.raza);
      fd.append('es_criollo', form.es_criollo);
      fd.append('cantidad', form.cantidad || 1);
      if (form.edad_meses) fd.append('edad_meses', form.edad_meses);
      if (form.peso_kg) fd.append('peso_kg', form.peso_kg);
      if (form.proposito) fd.append('proposito', form.proposito);
      if (form.descripcion) fd.append('descripcion', form.descripcion);
      if (form.precio_esperado) fd.append('precio_esperado', form.precio_esperado);
      fd.append('propietario_nombre', form.propietario_nombre);
      fd.append('propietario_telefono', form.propietario_telefono);
      if (form.zona) fd.append('zona', form.zona);
      if (foto) fd.append('foto', foto);

      const creado = await api.publicarAnimal(fd);
      setToken(creado.token_gestion);
      setPublicado(true);
    } catch (e) {
      setError(e.message || 'No pudimos publicar el animal. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  if (publicado) {
    return (
      <div className="contenedor" style={{ padding: '60px 20px', maxWidth: '560px' }}>
        <div style={estilos.exitoBox}>
          <CheckCircle2 size={48} color="var(--verde-exito)" />
          <h2 style={{ marginTop: '16px' }}>Tu publicación quedó en revisión</h2>
          <p style={estilos.exitoTexto}>
            La revisamos pronto y, en cuanto se apruebe, aparecerá en el catálogo
            para que los compradores puedan verla y contactarte. Esto evita que
            entren publicaciones falsas o de prueba al catálogo público.
          </p>
          <EnlaceGestion token={token} />
          <button className="btn btn-primario" onClick={() => navigate('/animales')}>
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contenedor" style={{ padding: '32px 20px 60px', maxWidth: '640px' }}>
      <h1 style={estilos.titulo}>Publica tu animal</h1>
      <p style={estilos.subtitulo}>
        Cuenta lo básico. Revisamos cada publicación antes de mostrarla, así que
        tómate un momento en llenar bien los datos — eso ayuda a que se apruebe rápido.
      </p>

      {error && <p style={estilos.errorTexto}>{error}</p>}

      <form onSubmit={manejarEnviar} style={estilos.form}>
        <div style={estilos.bloque}>
          <h3 style={estilos.bloqueTitulo}>Datos del animal</h3>

          <label style={estilos.label}>
            Especie *
            <select
              value={form.especie}
              onChange={(e) => actualizar('especie', e.target.value)}
              style={estilos.input}
            >
              {ESPECIES.map((e) => (
                <option key={e.valor} value={e.valor}>
                  {e.emoji} {e.label}
                </option>
              ))}
            </select>
          </label>

          <label style={estilos.label}>
            {form.especie === 'aves' ? 'Tipo o clase *' : 'Raza o tipo *'}
            <input
              type="text"
              value={form.raza}
              onChange={(e) => actualizar('raza', e.target.value)}
              placeholder={PLACEHOLDER_RAZA[form.especie] || 'Raza, tipo o descripción corta'}
              required
              style={estilos.input}
            />
          </label>

          <label style={estilos.checkbox}>
            <input
              type="checkbox"
              checked={form.es_criollo}
              onChange={(e) => actualizar('es_criollo', e.target.checked)}
            />
            Es criollo / mestizo (sin raza definida)
          </label>

          <label style={estilos.label}>
            {esLote ? 'Cantidad (tamaño del lote) *' : 'Cantidad'}
            <input
              type="number"
              min="1"
              value={form.cantidad}
              onChange={(e) => actualizar('cantidad', e.target.value)}
              placeholder={esLote ? 'Ej: 20 gallinas, 10 lechones…' : '1'}
              style={estilos.input}
            />
          </label>

          <div style={estilos.fila}>
            <label style={estilos.label}>
              Edad (meses)
              <input
                type="number"
                min="0"
                value={form.edad_meses}
                onChange={(e) => actualizar('edad_meses', e.target.value)}
                style={estilos.input}
              />
            </label>
            <label style={estilos.label}>
              Peso aprox. (kg)
              <input
                type="number"
                min="0"
                value={form.peso_kg}
                onChange={(e) => actualizar('peso_kg', e.target.value)}
                style={estilos.input}
              />
            </label>
          </div>

          <label style={estilos.label}>
            Propósito
            <select
              value={form.proposito}
              onChange={(e) => actualizar('proposito', e.target.value)}
              style={estilos.input}
            >
              <option value="">Sin especificar</option>
              {PROPOSITOS.map((p) => (
                <option key={p.valor} value={p.valor}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <label style={estilos.label}>
            Descripción (opcional)
            <textarea
              value={form.descripcion}
              onChange={(e) => actualizar('descripcion', e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Cualquier detalle que ayude: salud, vacunas, temperamento…"
              style={{ ...estilos.input, resize: 'vertical' }}
            />
            <span style={{ fontSize: '12px', textAlign: 'right', fontWeight: 500, color: form.descripcion.length >= 2000 ? 'var(--rojo-alerta)' : 'var(--carbon-suave)' }}>
              {form.descripcion.length} / 2000 caracteres
            </span>
          </label>

          <label style={estilos.labelFoto}>
            <Camera size={18} />
            {foto ? 'Cambiar foto' : 'Subir foto del animal'}
            <input type="file" accept="image/*" onChange={manejarFoto} style={{ display: 'none' }} />
          </label>
          {fotoPreview && (
            <img src={fotoPreview} alt="Vista previa" style={estilos.preview} />
          )}
        </div>

        <div style={estilos.bloque}>
          <h3 style={estilos.bloqueTitulo}>Precio</h3>
          <label style={estilos.label}>
            Precio que esperas
            <CampoPrecio
              value={form.precio_esperado}
              onChange={(v) => actualizar('precio_esperado', v)}
              placeholder="Los compradores pueden ofertar sobre este valor"
              style={estilos.input}
            />
          </label>
        </div>

        <div style={estilos.bloque}>
          <h3 style={estilos.bloqueTitulo}>Tus datos de contacto</h3>
          <p style={estilos.bloqueNota}>
            Solo se muestran a compradores interesados para que te escriban por WhatsApp.
          </p>

          <label style={estilos.label}>
            Tu nombre *
            <input
              type="text"
              value={form.propietario_nombre}
              onChange={(e) => actualizar('propietario_nombre', e.target.value)}
              required
              style={estilos.input}
            />
          </label>

          <label style={estilos.label}>
            Tu número de WhatsApp *
            <input
              type="tel"
              value={form.propietario_telefono}
              onChange={(e) => actualizar('propietario_telefono', e.target.value)}
              placeholder="Ej: 3001234567"
              required
              style={estilos.input}
            />
          </label>

          <label style={estilos.label}>
            Vereda o municipio
            <input
              type="text"
              value={form.zona}
              onChange={(e) => actualizar('zona', e.target.value)}
              placeholder="Ej: Orito, Putumayo"
              style={estilos.input}
            />
          </label>
        </div>

        <button type="submit" className="btn btn-primario" disabled={enviando} style={{ padding: '14px' }}>
          {enviando ? 'Publicando…' : 'Enviar para revisión'}
        </button>
      </form>
    </div>
  );
}

const estilos = {
  titulo: {
    fontSize: '30px',
    marginBottom: '8px',
  },
  subtitulo: {
    color: 'var(--carbon-suave)',
    fontSize: '15px',
    marginBottom: '28px',
    lineHeight: 1.6,
  },
  errorTexto: {
    color: 'var(--rojo-alerta)',
    background: 'rgba(168, 64, 47, 0.08)',
    padding: '12px 16px',
    borderRadius: 'var(--radius)',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  bloque: {
    background: 'var(--crema-card)',
    border: '1px solid var(--linea)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  bloqueTitulo: {
    fontSize: '17px',
    marginBottom: '0px',
  },
  bloqueNota: {
    fontSize: '13px',
    color: 'var(--carbon-suave)',
    margin: '-8px 0 0',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--carbon)',
    flex: 1,
    minWidth: 0, // permite que el campo se encoja y no se salga en móvil
  },
  fila: {
    display: 'flex',
    gap: '14px',
  },
  input: {
    padding: '11px 14px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--linea)',
    background: 'white',
    fontWeight: 400,
    width: '100%', // evita que el input se desborde del contenedor en móvil
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 500,
  },
  labelFoto: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '11px 16px',
    border: '1.5px dashed var(--linea)',
    borderRadius: 'var(--radius)',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--verde-pasto)',
    cursor: 'pointer',
    width: 'fit-content',
  },
  preview: {
    width: '160px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--linea)',
  },
  exitoBox: {
    textAlign: 'center',
    padding: '40px',
    background: 'var(--crema-card)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--linea)',
  },
  exitoTexto: {
    color: 'var(--carbon-suave)',
    lineHeight: 1.6,
    margin: '12px 0 24px',
  },
};
