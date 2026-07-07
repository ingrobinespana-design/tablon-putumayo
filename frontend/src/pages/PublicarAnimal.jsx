import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function PublicarAnimal() {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [publicado, setPublicado] = useState(false);

  const [form, setForm] = useState({
    raza: '',
    es_criollo: false,
    edad_meses: '',
    peso_kg: '',
    proposito: 'carne',
    descripcion: '',
    precio_piso: '',
    precio_esperado: '',
    propietario_nombre: '',
    propietario_telefono: '',
    zona: '',
  });
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  function actualizar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function manejarFoto(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;
    setFoto(archivo);
    setFotoPreview(URL.createObjectURL(archivo));
  }

  async function manejarEnviar(e) {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const fd = new FormData();
      fd.append('raza', form.raza);
      fd.append('es_criollo', form.es_criollo);
      if (form.edad_meses) fd.append('edad_meses', form.edad_meses);
      if (form.peso_kg) fd.append('peso_kg', form.peso_kg);
      fd.append('proposito', form.proposito);
      if (form.descripcion) fd.append('descripcion', form.descripcion);
      if (form.precio_piso) fd.append('precio_piso', form.precio_piso);
      if (form.precio_esperado) fd.append('precio_esperado', form.precio_esperado);
      fd.append('propietario_nombre', form.propietario_nombre);
      fd.append('propietario_telefono', form.propietario_telefono);
      if (form.zona) fd.append('zona', form.zona);
      if (foto) fd.append('foto', foto);

      await api.publicarAnimal(fd);
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
          <button className="btn btn-primario" onClick={() => navigate('/')}>
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
            Raza *
            <input
              type="text"
              value={form.raza}
              onChange={(e) => actualizar('raza', e.target.value)}
              placeholder="Ej: Brahman, Cebú, Criollo, mestizo…"
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
            Propósito *
            <select
              value={form.proposito}
              onChange={(e) => actualizar('proposito', e.target.value)}
              style={estilos.input}
            >
              <option value="carne">Para carne</option>
              <option value="genetica">Genética / cría</option>
              <option value="leche">Leche</option>
              <option value="doble_proposito">Doble propósito</option>
            </select>
          </label>

          <label style={estilos.label}>
            Descripción (opcional)
            <textarea
              value={form.descripcion}
              onChange={(e) => actualizar('descripcion', e.target.value)}
              rows={3}
              placeholder="Cualquier detalle que ayude: salud, vacunas, temperamento…"
              style={{ ...estilos.input, resize: 'vertical' }}
            />
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
          <div style={estilos.fila}>
            <label style={estilos.label}>
              Precio que daría la pesa local
              <input
                type="number"
                min="0"
                value={form.precio_piso}
                onChange={(e) => actualizar('precio_piso', e.target.value)}
                placeholder="Opcional, para comparar"
                style={estilos.input}
              />
            </label>
            <label style={estilos.label}>
              Precio que esperas
              <input
                type="number"
                min="0"
                value={form.precio_esperado}
                onChange={(e) => actualizar('precio_esperado', e.target.value)}
                style={estilos.input}
              />
            </label>
          </div>
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
