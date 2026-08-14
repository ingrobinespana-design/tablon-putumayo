import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, MapPin, ArrowLeft } from 'lucide-react';
import { api, API_URL } from '../services/api';
import { comisionDe, desgloseComision } from '../config/catalogo';
import { LABEL_ELECTRO_TIPO } from '../config/electro_data';
import BotonCompartir from '../components/BotonCompartir';
import CampoPrecio from '../components/CampoPrecio';

const ETIQUETAS_SELLO = {
  disponible: { texto: 'Disponible', clase: 'sello-disponible' },
  en_negociacion: { texto: 'En negociación', clase: 'sello-negociacion' },
  vendido: { texto: 'Vendido', clase: 'sello-vendido' },
};

function fmtCOP(v) { return '$' + Math.round(v).toLocaleString('es-CO'); }
function urlFoto(u) { return u.startsWith('http') ? u : `${API_URL}${u}`; }

export default function DetalleElectro() {
  const { id } = useParams();
  const [pub, setPub] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [fotoActiva, setFotoActiva] = useState(0);

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [monto, setMonto] = useState('');
  const [nota, setNota] = useState('');

  useEffect(() => {
    api.obtenerPublicacion(id)
      .then(setPub)
      .catch(() => setError('No encontramos este artículo. Puede que ya se haya vendido o el enlace esté mal.'))
      .finally(() => setCargando(false));
  }, [id]);

  async function enviarOferta(e) {
    e.preventDefault();
    if (!nombre.trim() || !monto) return;
    setEnviando(true);
    try {
      await api.registrarOfertaPublicacion(id, {
        comprador_nombre: nombre, comprador_telefono: telefono || null,
        monto_ofertado: parseFloat(monto), nota: nota || null,
      });
      setEnviado(true);
    } catch (e) { setError(e.message); } finally { setEnviando(false); }
  }

  function linkWhatsApp() {
    if (!pub) return '#';
    const tel = pub.propietario_telefono.replace(/\D/g, '');
    const msg = encodeURIComponent(`Hola, vi tu publicación de ${pub.titulo} en Vende Putumayo. Me interesa, ¿podemos hablar?`);
    return `https://wa.me/${tel}?text=${msg}`;
  }

  if (cargando) return <div className="contenedor" style={{ padding: '40px 20px' }}>Cargando…</div>;
  if (error && !pub) {
    return (
      <div className="contenedor" style={{ padding: '40px 20px' }}>
        <p style={{ color: 'var(--rojo-alerta)' }}>{error}</p>
        <Link to="/electrodomesticos" className="btn btn-secundario" style={{ marginTop: '16px' }}>
          <ArrowLeft size={16} /> Volver
        </Link>
      </div>
    );
  }

  const sello = ETIQUETAS_SELLO[pub.estado] || ETIQUETAS_SELLO.disponible;
  const a = pub.atributos || {};
  const galeria = Array.isArray(pub.fotos) && pub.fotos.length
    ? pub.fotos
    : (pub.foto_url ? [{ url: pub.foto_url, pie: null }] : []);
  const activa = galeria[fotoActiva] || galeria[0];
  const comision = comisionDe(pub);
  const d = monto ? desgloseComision(monto, comision) : null;

  return (
    <div className="contenedor" style={{ padding: '28px 20px 60px' }}>
      <Link to="/electrodomesticos" style={estilos.volver}><ArrowLeft size={16} /> Volver</Link>

      <div className="detalle-layout">
        <div>
          <div style={estilos.fotoPrincipalWrap}>
            {activa ? (
              <img src={urlFoto(activa.url)} alt={pub.titulo} style={estilos.fotoPrincipal} />
            ) : (
              <div style={estilos.sinFoto}><span style={{ fontSize: '90px' }}>📺</span></div>
            )}
          </div>
          {activa && activa.pie && <p style={estilos.pie}>{activa.pie}</p>}
          {galeria.length > 1 && (
            <div style={estilos.miniaturas}>
              {galeria.map((f, i) => (
                <button key={i} type="button" onClick={() => setFotoActiva(i)}
                  style={{ ...estilos.miniBtn, ...(i === fotoActiva ? estilos.miniActiva : {}) }}>
                  <img src={urlFoto(f.url)} alt={f.pie || `Foto ${i + 1}`} style={estilos.mini} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className={`sello ${sello.clase}`}>{sello.texto}</span>
          <h1 style={estilos.titulo}>{pub.titulo}</h1>
          <p style={estilos.tipo}>📺 {LABEL_ELECTRO_TIPO[a.tipo] || 'Electrodoméstico'}</p>

          <div style={estilos.datos}>
            {a.marca && <Dato label="Marca" valor={a.marca} />}
            {a.referencia && <Dato label="Referencia" valor={a.referencia} />}
            {a.capacidad && <Dato label="Capacidad / tamaño" valor={a.capacidad} />}
            {a.estado && <Dato label="Estado" valor={a.estado === 'nuevo' ? 'Nuevo' : 'Usado'} />}
            {pub.zona && <Dato label={<><MapPin size={13} /> Zona</>} valor={pub.zona} />}
          </div>

          {pub.descripcion && <p style={estilos.descripcion}>{pub.descripcion}</p>}

          {pub.precio_esperado && (
            <div style={estilos.precioBox}>
              <span>Precio esperado</span>
              <strong>{fmtCOP(pub.precio_esperado)}</strong>
            </div>
          )}

          {pub.estado !== 'vendido' && (
            <div style={estilos.botones}>
              <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp"
                style={{ flex: 1, padding: '14px' }}>
                <MessageCircle size={18} /> Contactar
              </a>
              <BotonCompartir titulo={pub.titulo} precio={pub.precio_esperado} ruta={`/electrodomestico/${pub.id}`} estilo={{ flex: 1, padding: '14px' }} />
            </div>
          )}

          {pub.estado !== 'vendido' && (
            <div style={estilos.ofertaBox}>
              <h3 style={estilos.ofertaTitulo}>Registrar oferta formal</h3>
              <p style={estilos.ofertaTexto}>
                Ayuda al vendedor a comparar ofertas. Si tu oferta es aceptada, se aplica una comisión
                del <strong>{comision.pct}%</strong>{' '}
                {comision.reparto === 'vendedor' ? '(la asume el vendedor).' : `dividida en partes iguales (${comision.pct / 2}% cada uno).`}
              </p>

              {enviado ? (
                <div style={estilos.exitoBox}>
                  <p style={{ fontWeight: 700, color: 'var(--verde-exito)', marginBottom: '6px' }}>✓ Oferta registrada</p>
                  <p style={{ fontSize: '13.5px', color: 'var(--carbon-suave)' }}>
                    Si el vendedor acepta, te contactará. Te recomendamos también escribir por WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={enviarOferta} style={estilos.form}>
                  <input type="text" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={estilos.input} />
                  <input type="tel" placeholder="Tu teléfono / WhatsApp" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={estilos.input} />
                  <CampoPrecio placeholder="Monto que ofreces (COP)" value={monto} onChange={setMonto} required style={estilos.input} />

                  {d && parseFloat(monto) > 0 && (
                    <div style={estilos.desgloseBox}>
                      <div style={estilos.desgloseTitle}>Desglose si tu oferta es aceptada</div>
                      <div style={estilos.desgloseFila}><span>Tu oferta</span><span>{fmtCOP(parseFloat(monto))}</span></div>
                      <div style={{ ...estilos.desgloseFila, color: 'var(--terracota)' }}><span>Tu comisión ({comision.pct / 2}%)</span><span>+ {fmtCOP(d.compradorPaga)}</span></div>
                      <div style={estilos.desgloseSep} />
                      <div style={{ ...estilos.desgloseFila, fontWeight: 700 }}><span>Total que pagarías</span><span>{fmtCOP(d.totalComprador)}</span></div>
                      <div style={{ ...estilos.desgloseFila, color: 'var(--carbon-suave)', fontSize: '13px' }}><span>El vendedor recibiría</span><span>{fmtCOP(d.recibeVendedor)}</span></div>
                    </div>
                  )}

                  <textarea placeholder="Nota para el vendedor (opcional)" value={nota} onChange={(e) => setNota(e.target.value)} rows={2} style={{ ...estilos.input, resize: 'vertical' }} />
                  <button type="submit" className="btn btn-primario" disabled={enviando}>{enviando ? 'Enviando…' : 'Registrar oferta'}</button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Dato({ label, valor }) {
  return (
    <div style={estilos.dato}>
      <span style={estilos.datoLabel}>{label}</span>
      <span>{valor}</span>
    </div>
  );
}

const estilos = {
  volver: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--carbon-suave)', fontSize: '14px', marginBottom: '20px' },
  fotoPrincipalWrap: { background: '#EDE6D3', borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '4 / 3' },
  fotoPrincipal: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  sinFoto: { width: '100%', height: '100%', minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  pie: { fontSize: '13.5px', color: 'var(--carbon-suave)', margin: '8px 2px 0', fontStyle: 'italic' },
  miniaturas: { display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' },
  miniBtn: { padding: 0, border: '2px solid transparent', borderRadius: 'var(--radius)', overflow: 'hidden', cursor: 'pointer', background: 'none', lineHeight: 0 },
  miniActiva: { borderColor: 'var(--verde-pasto)' },
  mini: { width: '64px', height: '48px', objectFit: 'cover', display: 'block' },
  titulo: { fontSize: '30px', margin: '10px 0 4px' },
  tipo: { color: 'var(--carbon-suave)', fontSize: '14px', marginBottom: '14px' },
  datos: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '18px 0', padding: '16px', background: 'var(--crema-card)', borderRadius: 'var(--radius)', border: '1px solid var(--linea)' },
  dato: { display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '15px' },
  datoLabel: { fontSize: '12px', color: 'var(--carbon-suave)', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: '4px' },
  descripcion: { color: 'var(--carbon)', lineHeight: 1.6, marginBottom: '16px', whiteSpace: 'pre-wrap', textAlign: 'justify' },
  precioBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(201, 162, 75, 0.12)', borderRadius: 'var(--radius)', fontSize: '15px', border: '1px solid var(--dorado)' },
  botones: { display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' },
  ofertaBox: { marginTop: '28px', paddingTop: '22px', borderTop: '1px solid var(--linea)' },
  ofertaTitulo: { fontSize: '18px', marginBottom: '4px' },
  ofertaTexto: { fontSize: '13.5px', color: 'var(--carbon-suave)', marginBottom: '14px', lineHeight: 1.6 },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '11px 14px', borderRadius: 'var(--radius)', border: '1.5px solid var(--linea)', background: 'var(--crema-card)', width: '100%' },
  desgloseBox: { background: 'var(--crema-card)', border: '1.5px solid var(--dorado)', borderRadius: 'var(--radius)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' },
  desgloseTitle: { fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--carbon-suave)', marginBottom: '4px' },
  desgloseFila: { display: 'flex', justifyContent: 'space-between', fontSize: '14px' },
  desgloseSep: { borderTop: '1px solid var(--linea)', margin: '4px 0' },
  exitoBox: { padding: '14px 16px', background: 'rgba(61, 107, 53, 0.08)', border: '1px solid var(--verde-exito)', borderRadius: 'var(--radius)' },
};
