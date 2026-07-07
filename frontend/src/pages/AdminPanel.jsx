import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, LogOut, TrendingUp, Clock, Package, DollarSign } from 'lucide-react';
import { api, API_URL } from '../services/api';

const COMISION_PCT = 10;

const PESTAÑAS = [
  { valor: 'pendiente', etiqueta: 'Por revisar' },
  { valor: 'disponible', etiqueta: 'Disponibles' },
  { valor: 'en_negociacion', etiqueta: 'En negociación' },
  { valor: 'vendido', etiqueta: 'Vendidos' },
];

function formatCOP(valor) {
  return '$' + Math.round(valor).toLocaleString('es-CO');
}

function calcularComision(monto) {
  const comisionCadaParte = monto * (COMISION_PCT / 2 / 100);
  const totalComprador = monto + comisionCadaParte;
  const recibeVendedor = monto - comisionCadaParte;
  const tuComision = comisionCadaParte * 2; // tú recibes el 5% de cada parte = 10% total
  return { comisionCadaParte, totalComprador, recibeVendedor, tuComision };
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [clave, setClave] = useState(null);
  const [pestaña, setPestaña] = useState('pendiente');
  const [animales, setAnimales] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [animalSeleccionado, setAnimalSeleccionado] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const c = sessionStorage.getItem('admin_clave');
    if (!c) {
      navigate('/admin');
      return;
    }
    setClave(c);
  }, [navigate]);

  const cargarDatos = useCallback(async () => {
    if (!clave) return;
    setCargando(true);
    try {
      const [listaAnimales, datosResumen] = await Promise.all([
        api.adminListarAnimales(clave, pestaña),
        api.adminResumen(clave),
      ]);
      setAnimales(listaAnimales);
      setResumen(datosResumen);
    } catch (e) {
      setError('No se pudo cargar la información');
    } finally {
      setCargando(false);
    }
  }, [clave, pestaña]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  async function aprobar(id) {
    try {
      await api.adminAprobar(clave, id);
      cargarDatos();
    } catch (e) {
      setError(e.message);
    }
  }

  async function rechazar(id) {
    const motivo = window.prompt('Motivo del rechazo (se guarda como referencia):');
    if (!motivo) return;
    try {
      await api.adminRechazar(clave, id, motivo);
      cargarDatos();
    } catch (e) {
      setError(e.message);
    }
  }

  async function verOfertas(animal) {
    setAnimalSeleccionado(animal);
    try {
      const lista = await api.adminListarOfertas(clave, animal.id);
      setOfertas(lista);
    } catch (e) {
      setError(e.message);
    }
  }

  async function cerrarVenta(ofertaId) {
    const confirmado = window.confirm(
      `¿Confirmas cerrar la venta con esta oferta?\nSe registrará la comisión del ${COMISION_PCT}% automáticamente.`
    );
    if (!confirmado) return;
    try {
      await api.adminCerrarVenta(clave, animalSeleccionado.id, ofertaId, COMISION_PCT);
      setAnimalSeleccionado(null);
      cargarDatos();
    } catch (e) {
      setError(e.message);
    }
  }

  function cerrarSesion() {
    sessionStorage.removeItem('admin_clave');
    navigate('/admin');
  }

  if (!clave) return null;

  return (
    <div className="contenedor" style={{ padding: '28px 20px 60px' }}>
      <div style={estilos.encabezado}>
        <h1 style={estilos.titulo}>Panel de gestión</h1>
        <button onClick={cerrarSesion} className="btn btn-secundario">
          <LogOut size={16} /> Salir
        </button>
      </div>

      {resumen && (
        <div style={estilos.resumenGrid}>
          <TarjetaResumen icono={<Clock size={18} />} etiqueta="Por revisar" valor={resumen.pendientes} />
          <TarjetaResumen icono={<Package size={18} />} etiqueta="Disponibles" valor={resumen.disponibles} />
          <TarjetaResumen icono={<TrendingUp size={18} />} etiqueta="En negociación" valor={resumen.en_negociacion} />
          <TarjetaResumen
            icono={<DollarSign size={18} />}
            etiqueta="Comisión generada"
            valor={formatCOP(resumen.comision_total_generada)}
          />
        </div>
      )}

      <div style={estilos.tabs}>
        {PESTAÑAS.map((p) => (
          <button
            key={p.valor}
            onClick={() => setPestaña(p.valor)}
            style={{
              ...estilos.tab,
              ...(pestaña === p.valor ? estilos.tabActiva : {}),
            }}
          >
            {p.etiqueta}
          </button>
        ))}
      </div>

      {error && <p style={{ color: 'var(--rojo-alerta)' }}>{error}</p>}
      {cargando && <p>Cargando…</p>}

      {!cargando && animales.length === 0 && (
        <p style={estilos.vacio}>No hay animales en esta categoría.</p>
      )}

      <div style={estilos.lista}>
        {animales.map((animal) => (
          <div key={animal.id} style={estilos.fila}>
            {animal.foto_url ? (
              <img src={`${API_URL}${animal.foto_url}`} alt={animal.raza} style={estilos.foto} />
            ) : (
              <div style={estilos.fotoVacia} />
            )}

            <div style={estilos.info}>
              <strong>{animal.raza}</strong>
              <span style={estilos.infoSub}>
                {animal.propietario_nombre} · {animal.propietario_telefono}
                {animal.zona ? ` · ${animal.zona}` : ''}
              </span>
              {animal.precio_esperado && (
                <span style={estilos.infoSub}>
                  Espera: {formatCOP(animal.precio_esperado)}
                </span>
              )}
              {animal.motivo_rechazo && (
                <span style={{ color: 'var(--rojo-alerta)', fontSize: '13px' }}>
                  Rechazado: {animal.motivo_rechazo}
                </span>
              )}
            </div>

            <div style={estilos.acciones}>
              {pestaña === 'pendiente' && (
                <>
                  <button onClick={() => aprobar(animal.id)} className="btn btn-primario" style={estilos.btnPequeño}>
                    <CheckCircle size={15} /> Aprobar
                  </button>
                  <button onClick={() => rechazar(animal.id)} className="btn btn-secundario" style={estilos.btnPequeño}>
                    <XCircle size={15} /> Rechazar
                  </button>
                </>
              )}
              {(pestaña === 'disponible' || pestaña === 'en_negociacion') && (
                <button onClick={() => verOfertas(animal)} className="btn btn-secundario" style={estilos.btnPequeño}>
                  Ver ofertas
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de ofertas con desglose de comisión */}
      {animalSeleccionado && (
        <div style={estilos.modalFondo} onClick={() => setAnimalSeleccionado(null)}>
          <div style={estilos.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '2px' }}>Ofertas — {animalSeleccionado.raza}</h3>
            <p style={estilos.infoSub}>
              {animalSeleccionado.zona} · Espera: {animalSeleccionado.precio_esperado ? formatCOP(animalSeleccionado.precio_esperado) : 'no indicado'}
            </p>

            {/* Nota de comisión */}
            <div style={estilos.notaComision}>
              Comisión: <strong>{COMISION_PCT}%</strong> total —
              el comprador paga <strong>{COMISION_PCT / 2}%</strong> extra y
              el vendedor cede <strong>{COMISION_PCT / 2}%</strong>.
              Tú recibes el <strong>{COMISION_PCT}%</strong> completo.
            </div>

            {ofertas.length === 0 && (
              <p style={{ marginTop: '16px', color: 'var(--carbon-suave)' }}>
                Todavía no hay ofertas registradas.
              </p>
            )}

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ofertas.map((oferta) => {
                const d = calcularComision(oferta.monto_ofertado);
                return (
                  <div key={oferta.id} style={oferta.es_ganadora ? { ...estilos.ofertaItem, borderColor: 'var(--verde-exito)' } : estilos.ofertaItem}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, marginBottom: '2px' }}>{oferta.comprador_nombre}</div>
                      {oferta.comprador_telefono && (
                        <div style={estilos.infoSub}>{oferta.comprador_telefono}</div>
                      )}
                      {oferta.nota && (
                        <div style={{ ...estilos.infoSub, marginTop: '4px', fontStyle: 'italic' }}>
                          "{oferta.nota}"
                        </div>
                      )}

                      {/* Desglose de comisión por oferta */}
                      <div style={estilos.desgloseOferta}>
                        <div style={estilos.desgloseOfertaFila}>
                          <span>Oferta del comprador</span>
                          <span style={{ fontWeight: 600 }}>{formatCOP(oferta.monto_ofertado)}</span>
                        </div>
                        <div style={{ ...estilos.desgloseOfertaFila, color: 'var(--terracota)' }}>
                          <span>Comprador paga ({COMISION_PCT / 2}%)</span>
                          <span>+ {formatCOP(d.comisionCadaParte)}</span>
                        </div>
                        <div style={{ ...estilos.desgloseOfertaFila, color: 'var(--terracota)' }}>
                          <span>Vendedor cede ({COMISION_PCT / 2}%)</span>
                          <span>- {formatCOP(d.comisionCadaParte)}</span>
                        </div>
                        <div style={estilos.desgloseSeparador} />
                        <div style={{ ...estilos.desgloseOfertaFila, fontWeight: 700, color: 'var(--verde-pasto-oscuro)' }}>
                          <span>Tu comisión total</span>
                          <span>{formatCOP(d.tuComision)}</span>
                        </div>
                        <div style={{ ...estilos.desgloseOfertaFila, fontSize: '12px', color: 'var(--carbon-suave)' }}>
                          <span>Vendedor recibe</span>
                          <span>{formatCOP(d.recibeVendedor)}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', marginLeft: '12px', flexShrink: 0 }}>
                      {oferta.es_ganadora ? (
                        <div style={estilos.vendidoBadge}>
                          ✓ Venta cerrada<br />
                          <span style={{ fontSize: '12px' }}>
                            Comisión: {formatCOP(oferta.comision_monto || d.tuComision)}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => cerrarVenta(oferta.id)}
                          className="btn btn-primario"
                          style={estilos.btnPequeño}
                        >
                          Cerrar venta
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setAnimalSeleccionado(null)}
              className="btn btn-secundario"
              style={{ marginTop: '20px', width: '100%' }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TarjetaResumen({ icono, etiqueta, valor }) {
  return (
    <div style={estilos.tarjetaResumen}>
      <div style={estilos.tarjetaIcono}>{icono}</div>
      <div>
        <div style={estilos.tarjetaValor}>{valor}</div>
        <div style={estilos.tarjetaEtiqueta}>{etiqueta}</div>
      </div>
    </div>
  );
}

const estilos = {
  encabezado: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  titulo: { fontSize: '28px' },
  resumenGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
    marginBottom: '28px',
  },
  tarjetaResumen: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'var(--crema-card)',
    border: '1px solid var(--linea)',
    borderRadius: 'var(--radius)',
    padding: '16px',
  },
  tarjetaIcono: { color: 'var(--terracota)' },
  tarjetaValor: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--verde-pasto-oscuro)',
  },
  tarjetaEtiqueta: {
    fontSize: '12.5px',
    color: 'var(--carbon-suave)',
  },
  tabs: {
    display: 'flex',
    gap: '6px',
    marginBottom: '20px',
    borderBottom: '1px solid var(--linea)',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '10px 16px',
    border: 'none',
    background: 'transparent',
    fontWeight: 600,
    color: 'var(--carbon-suave)',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
  },
  tabActiva: {
    color: 'var(--verde-pasto-oscuro)',
    borderBottom: '3px solid var(--terracota)',
  },
  vacio: {
    color: 'var(--carbon-suave)',
    padding: '30px 0',
  },
  lista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  fila: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'var(--crema-card)',
    border: '1px solid var(--linea)',
    borderRadius: 'var(--radius)',
    padding: '12px',
  },
  foto: {
    width: '64px',
    height: '64px',
    borderRadius: 'var(--radius)',
    objectFit: 'cover',
    flexShrink: 0,
  },
  fotoVacia: {
    width: '64px',
    height: '64px',
    borderRadius: 'var(--radius)',
    background: '#EDE6D3',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    fontSize: '14px',
  },
  infoSub: {
    fontSize: '13px',
    color: 'var(--carbon-suave)',
  },
  acciones: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  btnPequeño: {
    padding: '8px 14px',
    fontSize: '13.5px',
  },
  modalFondo: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(31, 27, 22, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 50,
  },
  modal: {
    background: 'var(--crema-card)',
    borderRadius: 'var(--radius)',
    padding: '28px',
    maxWidth: '520px',
    width: '100%',
    maxHeight: '85vh',
    overflowY: 'auto',
  },
  notaComision: {
    marginTop: '10px',
    padding: '10px 14px',
    background: 'rgba(201, 162, 75, 0.12)',
    border: '1px solid var(--dorado)',
    borderRadius: 'var(--radius)',
    fontSize: '13px',
    color: 'var(--carbon)',
    lineHeight: 1.5,
  },
  ofertaItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '14px',
    background: 'white',
    border: '1.5px solid var(--linea)',
    borderRadius: 'var(--radius)',
  },
  desgloseOferta: {
    marginTop: '10px',
    padding: '10px 12px',
    background: 'var(--crema)',
    borderRadius: 'var(--radius)',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  desgloseOfertaFila: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  desgloseSeparador: {
    borderTop: '1px solid var(--linea)',
    margin: '2px 0',
  },
  vendidoBadge: {
    color: 'var(--verde-exito)',
    fontWeight: 700,
    fontSize: '13px',
    lineHeight: 1.5,
  },
};
