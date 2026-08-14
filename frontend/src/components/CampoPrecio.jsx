// Campo para montos en pesos: el usuario escribe solo números y se ven los
// puntos de miles automáticamente (ej: 180000000 → 180.000.000).
// `value` guarda solo dígitos (string); `onChange` recibe solo dígitos.
export default function CampoPrecio({ value, onChange, style, placeholder, required, autoFocus }) {
  const display = value ? Number(value).toLocaleString('es-CO') : '';
  return (
    <input
      type="text"
      inputMode="numeric"
      value={display}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
      placeholder={placeholder}
      required={required}
      autoFocus={autoFocus}
      style={style}
    />
  );
}
