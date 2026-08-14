import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Copy, PartyPopper } from 'lucide-react';
import { api } from '../services/api';
import { comisionDe, comisionVendedorPaga, NEQUI } from '../config/catalogo';
import CampoPrecio from '../components/CampoPrecio';

function fmtCOP(v) { return '$' + Math.round(v).toLocaleString('es-CO'); }

export default function GestionAviso() {
  const { token } = useParams();
  const [pub, setPub] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [modo, setModo] = useState('ver');   // ver | reportar
  const [monto, setMonto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    api.obtenerGestion(token)
      .then(setPub)
      .catch(() => setError('Este enlace no es válido o el aviso ya no existe.'))
      .finally(() => setCargando(false));
  }, [token]);

  async function reportar(e) {
    e.preventDefault();
    if (!monto) return;
    setEnviando(true);
    setError(null);
    try {
      const actualizado = await api.reportarVendido(token, parseFloat(monto));
      setPub(actualizado);
      setModo('ver');
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  function copiarNequi() {
    navigator.clipboard?.writeText(NEQUI).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  if (cargando) return <div className="contenedor" style={{ padding: '40px 20px' }}>Cargando…</div>;
  if (error && !pub) {
    return (
      <div className="contenedor" style={{ padding: '40px 20px', maxWidth: '560px' }}>
        <p style={{ color: 'var(--rojo-alerta)' }}>{error}</p>
        <Link to="/" className="btn btn-secundario" style={{ marginTop: '16px' }}>Ir al inicio</Link>
      </div>
    );
  }

  const vendido = pub.estado === 'vendido';
  const comision = comisionDe(pub);
  const montoBase = vendido ? (pub.monto_venta || 0) : (parseFloat(monto) || 0);
  const aPagar = comisionVendedorPaga(pub, montoBase);

  return (
    <div className="contenedor" style={{ padding: '40px 20px 60px', maxWidth: '560px' }}>
      <div style={estilos.tarjeta}>
        <p style={estilos.mini}>Administrar mi aviso</p>
        <h1 style={estilos.titulo}>{pub.titulo || pub.raza}</h1>
        <p style={estilos.sub}>
          Estado: <strong>{vendido ? 'Vendido' : (pub.estado === 'pendiente' ? 'En revisión' : 'Publicado')}</strong>
          {pub.precio_esperado ? ` · Esperabas ${fmtCOP(pub.precio_esperado)}` : ''}
        </p>

        {error && <p style={estilos.error}>{error}</p>}

        {/* Aún no vendido */}
        {!vendido && modo === 'ver' && (
          <>
            <p style={estilos.texto}>
              Cuando lo vendas, repórtalo aquí. Es rápido y nos ayuda a mantener el Tablón al día.
            </p>
            <button className="btn btn-primario" style={{ width: '100%', padding: '14px' }} onClick={() => setModo('reportar')}>
              <CheckCircle2 size={18} /> Ya lo vendí
            </button>
          </>
        )}

        {!vendido && modo === 'reportar' && (
          <form onSubmit={reportar} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={estilos.label}>
              ¿En cuánto lo vendiste? (COP)
              <CampoPrecio value={monto} onChange={setMonto}
                placeholder="Ej: 3.500.000" required autoFocus style={estilos.input} />
            </label>
            {parseFloat(monto) > 0 && (
              <div style={estilos.avisoComision}>
                Comisión de Vende Putumayo ({comision.reparto === 'vendedor' ? `${comision.pct}%` : `${comision.pct / 2}%`}):{' '}
                <strong>{fmtCOP(comisionVendedorPaga(pub, monto))}</strong>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn btn-secundario" style={{ flex: 1 }} onClick={() => setModo('ver')}>Cancelar</button>
              <button type="submit" className="btn btn-primario" style={{ flex: 1 }} disabled={enviando}>
                {enviando ? 'Guardando…' : 'Confirmar venta'}
              </button>
            </div>
          </form>
        )}

        {/* Ya vendido → cómo pagar */}
        {vendido && (
          <div style={estilos.exito}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--verde-exito)' }}>
              <PartyPopper size={22} />
              <strong style={{ fontSize: '17px' }}>¡Felicitaciones por tu venta!</strong>
            </div>
            {pub.monto_venta ? <p style={estilos.texto}>Vendido en {fmtCOP(pub.monto_venta)}.</p> : null}

            <div style={estilos.pagoBox}>
              <p style={estilos.pagoLabel}>Comisión a pagar</p>
              <p style={estilos.pagoMonto}>{fmtCOP(aPagar)}</p>
              <p style={estilos.pagoTexto}>
                Págala por <strong>Nequi</strong> a este número (también es la llave):
              </p>
              <div style={estilos.nequiFila}>
                <span style={estilos.nequiNum}>{NEQUI}</span>
                <button type="button" className="btn btn-secundario" style={{ padding: '8px 12px' }} onClick={copiarNequi}>
                  <Copy size={15} /> {copiado ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p style={estilos.pagoNota}>
                Con tu comisión ayudas a que Vende Putumayo siga funcionando para toda la región. ¡Gracias! 🙌
              </p>
            </div>
          </div>
        )}
      </div>

      <p style={estilos.pie}>
        Guarda este enlace para administrar tu aviso cuando quieras.
      </p>
    </div>
  );
}

const estilos = {
  tarjeta: { background: 'var(--crema-card)', border: '1px solid var(--linea)', borderRadius: 'var(--radius)', padding: '28px' },
  mini: { fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--terracota)', fontWeight: 700, marginBottom: '4px' },
  titulo: { fontSize: '24px', marginBottom: '4px' },
  sub: { color: 'var(--carbon-suave)', fontSize: '14px', marginBottom: '18px' },
  texto: { color: 'var(--carbon)', lineHeight: 1.6, marginBottom: '16px', fontSize: '14.5px' },
  error: { color: 'var(--rojo-alerta)', background: 'rgba(168, 64, 47, 0.08)', padding: '10px 14px', borderRadius: 'var(--radius)', marginBottom: '14px' },
  label: { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px', fontWeight: 600 },
  input: { padding: '12px 14px', borderRadius: 'var(--radius)', border: '1.5px solid var(--linea)', background: 'white' },
  avisoComision: { background: 'rgba(201, 162, 75, 0.12)', border: '1px solid var(--dorado)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '14px' },
  exito: { display: 'flex', flexDirection: 'column', gap: '14px' },
  pagoBox: { background: 'rgba(61, 107, 53, 0.06)', border: '1px solid var(--verde-exito)', borderRadius: 'var(--radius)', padding: '18px' },
  pagoLabel: { fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--carbon-suave)', fontWeight: 700, margin: 0 },
  pagoMonto: { fontSize: '30px', fontFamily: 'var(--font-display)', color: 'var(--verde-pasto-oscuro)', margin: '2px 0 10px' },
  pagoTexto: { fontSize: '14px', margin: '0 0 8px' },
  nequiFila: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  nequiNum: { fontSize: '22px', fontWeight: 700, letterSpacing: '0.02em', color: 'var(--carbon)' },
  pagoNota: { fontSize: '13px', color: 'var(--carbon-suave)', marginTop: '12px', lineHeight: 1.5 },
  pie: { textAlign: 'center', fontSize: '12.5px', color: 'var(--carbon-suave)', marginTop: '16px' },
};
