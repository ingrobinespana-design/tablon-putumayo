import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, MapPin, ArrowLeft, Beef } from 'lucide-react';
import { api, API_URL } from '../services/api';

const ETIQUETAS_SELLO = {
  disponible: { texto: 'Disponible', clase: 'sello-disponible' },
  en_negociacion: { texto: 'En negociación', clase: 'sello-negociacion' },
  vendido: { texto: 'Vendido', clase: 'sello-vendido' },
};

const ETIQUETAS_PROPOSITO = {
  carne: 'Para carne',
  genetica: 'Genética / cría',
  leche: 'Leche',
  doble_proposito: 'Doble propósito',
};

const COMISION_PCT = 5; // 5% total, 2.5% cada parte

function calcularComision(monto) {
  const total = parseFloat(monto) || 0;
  const comisionTotal = total * (COMISION_PCT / 100);
  const comisionCadaParte = comisionTotal / 2;
  const totalComprador = total + comisionCadaParte;
  const recibeVendedor = total - comisionCadaParte;
  return { comisionTotal, comisionCadaParte, totalComprador, recibeVendedor };
}

function formatCOP(valor) {
  return '$' + Math.round(valor).toLocaleString('es-CO');
}

export default function DetalleAnimal() {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [monto, setMonto] = useState('');
  const [nota, setNota] = useState('');

  useEffect(() => {
    api
      .obtenerAnimal(id)
      .then(setAnimal)
      .catch(() => setError('No encontramos este animal. Puede que ya se haya vendido o el enlace esté mal.'))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEnviarOferta(e) {
    e.preventDefault();
    if (!nombre.trim() || !monto) return;
    setEnviando(true);
    try {
      await api.registrarOferta(id, {
        comprador_nombre: nombre,
        comprador_telefono: telefono || null,
        monto_ofertado: parseFloat(monto),
        nota: nota || null,
      });
      setEnviado(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  function linkWhatsApp() {
    if (!animal) return '#';
    const telefonoLimpio = animal.propietario_telefono.replace(/\D/g, '');
    const mensaje = encodeURIComponent(
      `Hola, vi tu publicación de ${animal.raza} en Tablón Putumayo. Me interesa, ¿podemos hablar?`
    );
    return `https://wa.me/${telefonoLimpio}?text=${mensaje}`;
  }

  if (cargando) {
    return <div className="contenedor" style={{ padding: '40px 20px' }}>Cargando…</div>;
  }

  if (error && !animal) {
    return (
      <div className="contenedor" style={{ padding: '40px 20px' }}>
        <p style={{ color: 'var(--rojo-alerta)' }}>{error}</p>
        <Link to="/" className="btn btn-secundario" style={{ marginTop: '16px' }}>
          <ArrowLeft size={16} /> Volver al catálogo
        </Link>
      </div>
    );
  }

  const sello = ETIQUETAS_SELLO[animal.estado] || ETIQUETAS_SELLO.disponible;
  const fotoSrc = animal.foto_url
    ? (animal.foto_url.startsWith('http') ? animal.foto_url : `${API_URL}${animal.foto_url}`)
    : null;
  const desglose = monto ? calcularComision(monto) : null;

  return (
    <div className="contenedor" style={{ padding: '28px 20px 60px' }}>
      <Link to="/" style={estilos.volver}>
        <ArrowLeft size={16} /> Volver al catálogo
      </Link>

      <div style={estilos.layout}>
        <div style={estilos.fotoContenedor}>
          {fotoSrc ? (
            <img src={fotoSrc} alt={animal.raza} style={estilos.foto} />
          ) : (
            <div style={estilos.fotoPlaceholder}>
              <Beef size={56} color="var(--linea)" />
            </div>
          )}
        </div>

        <div>
          <span className={`sello ${sello.clase}`}>{sello.texto}</span>
          <h1 style={estilos.titulo}>{animal.raza}</h1>
          {animal.es_criollo && <p style={estilos.criollo}>Ganado criollo / mestizo</p>}

          <div style={estilos.datos}>
            {animal.edad_meses != null && (
              <div style={estilos.dato}>
                <span style={estilos.datoLabel}>Edad</span>
                <span>{animal.edad_meses} meses</span>
              </div>
            )}
            {animal.peso_kg != null && (
              <div style={estilos.dato}>
                <span style={estilos.datoLabel}>Peso aprox.</span>
                <span>{animal.peso_kg} kg</span>
              </div>
            )}
            <div style={estilos.dato}>
              <span style={estilos.datoLabel}>Propósito</span>
              <span>{ETIQUETAS_PROPOSITO[animal.proposito]}</span>
            </div>
            {animal.zona && (
              <div style={estilos.dato}>
                <span style={estilos.datoLabel}><MapPin size={13} /> Zona</span>
                <span>{animal.zona}</span>
              </div>
            )}
          </div>

          {animal.descripcion && <p style={estilos.descripcion}>{animal.descripcion}</p>}

          {animal.precio_esperado && (
            <div style={estilos.precioBox}>
              <span>Precio esperado por el propietario</span>
              <strong>{formatCOP(animal.precio_esperado)}</strong>
            </div>
          )}

          {animal.estado !== 'vendido' && (
            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ width: '100%', marginTop: '20px', padding: '14px' }}
            >
              <MessageCircle size={18} /> Contactar por WhatsApp
            </a>
          )}

          {animal.estado !== 'vendido' && (
            <div style={estilos.ofertaBox}>
              <h3 style={estilos.ofertaTitulo}>Registrar oferta formal</h3>
              <p style={estilos.ofertaTexto}>
                Esto ayuda al propietario a comparar todas las ofertas antes de decidir.
                Si tu oferta es aceptada, se aplica una comisión del <strong>{COMISION_PCT}%</strong> dividida
                en partes iguales entre comprador y vendedor ({COMISION_PCT / 2}% cada uno).
              </p>

              {enviado ? (
                <div style={estilos.exitoBox}>
                  <p style={{ fontWeight: 700, color: 'var(--verde-exito)', marginBottom: '6px' }}>
                    ✓ Oferta registrada exitosamente
                  </p>
                  <p style={{ fontSize: '13.5px', color: 'var(--carbon-suave)' }}>
                    Si el propietario acepta tu oferta, te contactará directamente.
                    Te recomendamos también escribir por WhatsApp para concretar más rápido.
                  </p>
                </div>
              ) : (
                <form onSubmit={manejarEnviarOferta} style={estilos.form}>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    style={estilos.input}
                  />
                  <input
                    type="tel"
                    placeholder="Tu teléfono / WhatsApp"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    style={estilos.input}
                  />
                  <input
                    type="number"
                    placeholder="Monto que ofreces (COP)"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    required
                    min="0"
                    style={estilos.input}
                  />

                  {/* Desglose de comisión en tiempo real */}
                  {desglose && parseFloat(monto) > 0 && (
                    <div style={estilos.desgloseBox}>
                      <div style={estilos.desgloseTitle}>Desglose si tu oferta es aceptada</div>
                      <div style={estilos.desgloseFilas}>
                        <div style={estilos.desgloseFila}>
                          <span>Tu oferta</span>
                          <span>{formatCOP(parseFloat(monto))}</span>
                        </div>
                        <div style={{ ...estilos.desgloseFila, color: 'var(--terracota)' }}>
                          <span>Tu comisión ({COMISION_PCT / 2}%)</span>
                          <span>+ {formatCOP(desglose.comisionCadaParte)}</span>
                        </div>
                        <div style={estilos.desgloseSeparador} />
                        <div style={{ ...estilos.desgloseFila, fontWeight: 700 }}>
                          <span>Total que pagarías</span>
                          <span>{formatCOP(desglose.totalComprador)}</span>
                        </div>
                        <div style={{ ...estilos.desgloseFila, color: 'var(--carbon-suave)', fontSize: '13px' }}>
                          <span>El vendedor recibiría</span>
                          <span>{formatCOP(desglose.recibeVendedor)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <textarea
                    placeholder="Nota para el propietario (opcional)"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    rows={2}
                    style={{ ...estilos.input, resize: 'vertical' }}
                  />
                  <button type="submit" className="btn btn-primario" disabled={enviando}>
                    {enviando ? 'Enviando…' : 'Registrar oferta'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const estilos = {
  volver: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--carbon-suave)',
    fontSize: '14px',
    marginBottom: '20px',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '36px',
  },
  fotoContenedor: {
    background: '#EDE6D3',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    minHeight: '360px',
  },
  foto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  fotoPlaceholder: {
    width: '100%',
    height: '100%',
    minHeight: '360px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: '32px',
    margin: '10px 0 4px',
  },
  criollo: {
    color: 'var(--carbon-suave)',
    fontSize: '14px',
    marginBottom: '14px',
  },
  datos: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    margin: '18px 0',
    padding: '16px',
    background: 'var(--crema-card)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--linea)',
  },
  dato: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    fontSize: '15px',
  },
  datoLabel: {
    fontSize: '12px',
    color: 'var(--carbon-suave)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  descripcion: {
    color: 'var(--carbon)',
    lineHeight: 1.6,
    marginBottom: '16px',
  },
  precioBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    background: 'rgba(201, 162, 75, 0.12)',
    borderRadius: 'var(--radius)',
    fontSize: '15px',
    border: '1px solid var(--dorado)',
  },
  ofertaBox: {
    marginTop: '28px',
    paddingTop: '22px',
    borderTop: '1px solid var(--linea)',
  },
  ofertaTitulo: {
    fontSize: '18px',
    marginBottom: '4px',
  },
  ofertaTexto: {
    fontSize: '13.5px',
    color: 'var(--carbon-suave)',
    marginBottom: '14px',
    lineHeight: 1.6,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '11px 14px',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--linea)',
    background: 'var(--crema-card)',
    width: '100%',
  },
  desgloseBox: {
    background: 'var(--crema-card)',
    border: '1.5px solid var(--dorado)',
    borderRadius: 'var(--radius)',
    padding: '14px 16px',
  },
  desgloseTitle: {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--carbon-suave)',
    marginBottom: '10px',
  },
  desgloseFilas: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  desgloseFila: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  desgloseSeparador: {
    borderTop: '1px solid var(--linea)',
    margin: '4px 0',
  },
  exitoBox: {
    padding: '14px 16px',
    background: 'rgba(61, 107, 53, 0.08)',
    border: '1px solid var(--verde-exito)',
    borderRadius: 'var(--radius)',
  },
};
