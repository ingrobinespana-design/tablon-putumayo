import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle2, X } from 'lucide-react';
import { api } from '../services/api';
import { INMUEBLE_TIPOS, UNIDADES_AREA, LABEL_INMUEBLE_TIPO, LABEL_UNIDAD, MAX_FOTOS } from '../config/catalogo';
import { comprimirImagen } from '../utils/imagen';
import EnlaceGestion from '../components/EnlaceGestion';
import CampoPrecio from '../components/CampoPrecio';

export default function PublicarInmueble() {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [publicado, setPublicado] = useState(false);
  const [token, setToken] = useState(null);

  const [form, setForm] = useState({
    tipo: 'casa', area: '', unidad: 'm2', habitaciones: '', banos: '',
    descripcion: '', precio_esperado: '', propietario_nombre: '', propietario_telefono: '', zona: '',
  });
  const [fotos, setFotos] = useState([]);
  const [comprimiendo, setComprimiendo] = useState(false);

  const esVivienda = form.tipo === 'casa' || form.tipo === 'apartamento';

  function actualizar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function agregarFotos(e) {
    const nuevas = Array.from(e.target.files || []);
    e.target.value = '';
    if (!nuevas.length) return;
    const cupo = MAX_FOTOS - fotos.length;
    const aProcesar = nuevas.slice(0, Math.max(0, cupo));
    if (!aProcesar.length) return;
    setComprimiendo(true);
    try {
      const comprimidas = await Promise.all(
        aProcesar.map(async (file) => {
          const optimizada = await comprimirImagen(file);
          return { file: optimizada, preview: URL.createObjectURL(optimizada), pie: '' };
        })
      );
      setFotos((prev) => [...prev, ...comprimidas].slice(0, MAX_FOTOS));
    } finally {
      setComprimiendo(false);
    }
  }

  function quitarFoto(i) { setFotos((prev) => prev.filter((_, idx) => idx !== i)); }
  function cambiarPie(i, v) { setFotos((prev) => prev.map((f, idx) => (idx === i ? { ...f, pie: v } : f))); }

  async function manejarEnviar(e) {
    e.preventDefault();
    setError(null);

    const tipoLabel = LABEL_INMUEBLE_TIPO[form.tipo] || 'Inmueble';
    const partes = [tipoLabel];
    if (esVivienda && form.habitaciones) partes.push(`${form.habitaciones} hab`);
    const titulo = partes.join(' ') +
      (form.area ? ` · ${form.area} ${LABEL_UNIDAD[form.unidad] || ''}`.trimEnd() : '');

    setEnviando(true);
    try {
      const atributos = {
        tipo: form.tipo,
        area: form.area ? Number(form.area) : null,
        unidad: form.unidad,
        habitaciones: esVivienda && form.habitaciones ? Number(form.habitaciones) : null,
        banos: esVivienda && form.banos ? Number(form.banos) : null,
      };
      const fd = new FormData();
      fd.append('categoria', 'inmuebles');
      fd.append('titulo', titulo);
      fd.append('atributos', JSON.stringify(atributos));
      if (form.descripcion) fd.append('descripcion', form.descripcion);
      if (form.precio_esperado) fd.append('precio_esperado', form.precio_esperado);
      fd.append('propietario_nombre', form.propietario_nombre);
      fd.append('propietario_telefono', form.propietario_telefono);
      if (form.zona) fd.append('zona', form.zona);
      fd.append('pies', JSON.stringify(fotos.map((f) => f.pie || '')));
      fotos.forEach((f) => fd.append('fotos', f.file));

      const creado = await api.publicarPublicacion(fd);
      setToken(creado.token_gestion);
      setPublicado(true);
    } catch (e) {
      setError(e.message || 'No pudimos publicar el inmueble. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  if (publicado) {
    return (
      <div className="contenedor" style={{ padding: '60px 20px', maxWidth: '560px' }}>
        <div style={estilos.exitoBox}>
          <CheckCircle2 size={48} color="var(--verde-exito)" />
          <h2 style={{ marginTop: '16px' }}>Tu inmueble quedó en revisión</h2>
          <p style={estilos.exitoTexto}>
            Lo revisamos pronto y, en cuanto se apruebe, aparecerá en el catálogo
            de inmuebles para que los compradores puedan verlo y contactarte.
          </p>
          <EnlaceGestion token={token} />
          <button className="btn btn-primario" onClick={() => navigate('/inmuebles')}>
            Ver catálogo de inmuebles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contenedor" style={{ padding: '32px 20px 60px', maxWidth: '660px' }}>
      <h1 style={estilos.titulo}>Publica tu inmueble</h1>
      <p style={estilos.subtitulo}>
        Entre más fotos y datos, más rápido se vende. Revisamos cada publicación antes de mostrarla.
      </p>

      {error && <p style={estilos.errorTexto}>{error}</p>}

      <form onSubmit={manejarEnviar} style={estilos.form}>
        <div style={estilos.bloque}>
          <h3 style={estilos.bloqueTitulo}>Datos del inmueble</h3>

          <label style={estilos.label}>
            Tipo *
            <select value={form.tipo} onChange={(e) => actualizar('tipo', e.target.value)} style={estilos.input}>
              {INMUEBLE_TIPOS.map((t) => (<option key={t.valor} value={t.valor}>{t.label}</option>))}
            </select>
          </label>

          <div style={estilos.fila}>
            <label style={estilos.label}>
              Área
              <input type="number" min="0" value={form.area} onChange={(e) => actualizar('area', e.target.value)}
                placeholder="Ej: 120" style={estilos.input} />
            </label>
            <label style={estilos.label}>
              Unidad
              <select value={form.unidad} onChange={(e) => actualizar('unidad', e.target.value)} style={estilos.input}>
                {UNIDADES_AREA.map((u) => (<option key={u.valor} value={u.valor}>{u.label}</option>))}
              </select>
            </label>
          </div>

          {esVivienda && (
            <div style={estilos.fila}>
              <label style={estilos.label}>
                Habitaciones
                <input type="number" min="0" value={form.habitaciones}
                  onChange={(e) => actualizar('habitaciones', e.target.value)} placeholder="Ej: 3" style={estilos.input} />
              </label>
              <label style={estilos.label}>
                Baños
                <input type="number" min="0" value={form.banos}
                  onChange={(e) => actualizar('banos', e.target.value)} placeholder="Ej: 2" style={estilos.input} />
              </label>
            </div>
          )}

          <label style={estilos.label}>
            Descripción (opcional)
            <textarea value={form.descripcion} onChange={(e) => actualizar('descripcion', e.target.value)}
              rows={4} maxLength={2000} placeholder="Ubicación, servicios, estado, papeles al día, motivo de venta…"
              style={{ ...estilos.input, resize: 'vertical' }} />
            <span style={{ ...estilos.contadorCar, color: form.descripcion.length >= 2000 ? 'var(--rojo-alerta)' : 'var(--carbon-suave)' }}>
              {form.descripcion.length} / 2000 caracteres
            </span>
          </label>
        </div>

        {/* Galería */}
        <div style={estilos.bloque}>
          <h3 style={estilos.bloqueTitulo}>Fotos del inmueble</h3>
          <p style={estilos.bloqueNota}>
            Sube varias (recomendado 6 o más): fachada, sala, cocina, habitaciones, baño, patio/terreno.
            A cada foto ponle un pie corto. Máximo {MAX_FOTOS}.
          </p>
          <div style={estilos.galeria}>
            {fotos.map((f, i) => (
              <div key={i} style={estilos.fotoItem}>
                <div style={estilos.fotoPrevWrap}>
                  <img src={f.preview} alt={`Foto ${i + 1}`} style={estilos.fotoPrev} />
                  <button type="button" onClick={() => quitarFoto(i)} style={estilos.quitar} aria-label="Quitar foto"><X size={14} /></button>
                </div>
                <input type="text" value={f.pie} onChange={(e) => cambiarPie(i, e.target.value)}
                  placeholder={`Pie de foto ${i + 1} (ej: cocina)`} maxLength={60} style={estilos.pieInput} />
              </div>
            ))}
            {fotos.length < MAX_FOTOS && (
              <label style={estilos.agregarFoto}>
                <Camera size={22} />
                <span style={{ fontSize: '12.5px' }}>{comprimiendo ? 'Optimizando…' : 'Agregar foto'}</span>
                <input type="file" accept="image/*" multiple onChange={agregarFotos} disabled={comprimiendo} style={{ display: 'none' }} />
              </label>
            )}
          </div>
          <p style={estilos.contador}>{fotos.length} / {MAX_FOTOS} fotos</p>
        </div>

        <div style={estilos.bloque}>
          <h3 style={estilos.bloqueTitulo}>Precio</h3>
          <label style={estilos.label}>
            Precio que esperas
            <CampoPrecio value={form.precio_esperado}
              onChange={(v) => actualizar('precio_esperado', v)}
              placeholder="Los compradores pueden ofertar sobre este valor" style={estilos.input} />
          </label>
        </div>

        <div style={estilos.bloque}>
          <h3 style={estilos.bloqueTitulo}>Tus datos de contacto</h3>
          <p style={estilos.bloqueNota}>Solo se muestran a compradores interesados para que te escriban por WhatsApp.</p>
          <label style={estilos.label}>
            Tu nombre *
            <input type="text" value={form.propietario_nombre} onChange={(e) => actualizar('propietario_nombre', e.target.value)} required style={estilos.input} />
          </label>
          <label style={estilos.label}>
            Tu número de WhatsApp *
            <input type="tel" value={form.propietario_telefono} onChange={(e) => actualizar('propietario_telefono', e.target.value)}
              placeholder="Ej: 3001234567" required style={estilos.input} />
          </label>
          <label style={estilos.label}>
            Vereda o municipio
            <input type="text" value={form.zona} onChange={(e) => actualizar('zona', e.target.value)}
              placeholder="Ej: Mocoa, Putumayo" style={estilos.input} />
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
  titulo: { fontSize: '30px', marginBottom: '8px' },
  subtitulo: { color: 'var(--carbon-suave)', fontSize: '15px', marginBottom: '28px', lineHeight: 1.6 },
  errorTexto: { color: 'var(--rojo-alerta)', background: 'rgba(168, 64, 47, 0.08)', padding: '12px 16px', borderRadius: 'var(--radius)', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '24px' },
  bloque: { background: 'var(--crema-card)', border: '1px solid var(--linea)', borderRadius: 'var(--radius)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' },
  bloqueTitulo: { fontSize: '17px', marginBottom: '0px' },
  bloqueNota: { fontSize: '13px', color: 'var(--carbon-suave)', margin: '-8px 0 0', lineHeight: 1.5 },
  label: { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--carbon)', flex: 1, minWidth: 0 },
  fila: { display: 'flex', gap: '14px' },
  input: { padding: '11px 14px', borderRadius: 'var(--radius)', border: '1.5px solid var(--linea)', background: 'white', fontWeight: 400, width: '100%' },
  contadorCar: { fontSize: '12px', textAlign: 'right', fontWeight: 500 },
  galeria: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' },
  fotoItem: { display: 'flex', flexDirection: 'column', gap: '6px' },
  fotoPrevWrap: { position: 'relative' },
  fotoPrev: { width: '100%', height: '96px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--linea)', display: 'block' },
  quitar: { position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '999px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  pieInput: { padding: '7px 9px', borderRadius: 'var(--radius)', border: '1.5px solid var(--linea)', background: 'white', fontSize: '12.5px', width: '100%' },
  agregarFoto: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '96px', border: '1.5px dashed var(--linea)', borderRadius: 'var(--radius)', color: 'var(--verde-pasto)', cursor: 'pointer', fontWeight: 600 },
  contador: { fontSize: '12.5px', color: 'var(--carbon-suave)', margin: '4px 0 0' },
  exitoBox: { textAlign: 'center', padding: '40px', background: 'var(--crema-card)', borderRadius: 'var(--radius)', border: '1px solid var(--linea)' },
  exitoTexto: { color: 'var(--carbon-suave)', lineHeight: 1.6, margin: '12px 0 24px' },
};
