// Catálogo de especies y propósitos del Tablón.
// Para agregar una especie nueva en el futuro, basta con añadir una línea aquí
// (y el mismo valor en EspecieEnum del backend). Todo lo demás se adapta solo.

// Emojis de cuerpo completo (más sobrios que las "caritas") para orientar
// visualmente cada especie sin verse caricaturescos.
export const ESPECIES = [
  { valor: 'bovino',   label: 'Bovinos',        singular: 'Bovino',  emoji: '🐄' },
  { valor: 'bufalino', label: 'Búfalos',        singular: 'Búfalo',  emoji: '🐃' },
  { valor: 'equino',   label: 'Caballos',       singular: 'Caballo', emoji: '🐎' },
  { valor: 'mular',    label: 'Mulas y machos', singular: 'Mular',   emoji: '🐴' },
  { valor: 'asnal',    label: 'Burros',         singular: 'Burro',   emoji: '🫏' },
  { valor: 'porcino',  label: 'Cerdos',         singular: 'Cerdo',   emoji: '🐖' },
  { valor: 'ovino',    label: 'Ovejas',         singular: 'Oveja',   emoji: '🐑' },
  { valor: 'caprino',  label: 'Cabras',         singular: 'Cabra',   emoji: '🐐' },
  { valor: 'aves',     label: 'Aves de corral', singular: 'Aves',    emoji: '🐔' },
];

export const PROPOSITOS = [
  { valor: 'carne',           label: 'Para carne' },
  { valor: 'leche',           label: 'Leche' },
  { valor: 'doble_proposito', label: 'Doble propósito' },
  { valor: 'genetica',        label: 'Genética / cría' },
  { valor: 'trabajo',         label: 'Trabajo / carga' },
  { valor: 'silla_deporte',   label: 'Silla / deporte' },
  { valor: 'postura',         label: 'Postura (huevos)' },
];

export const ETIQUETA_ESPECIE = Object.fromEntries(
  ESPECIES.map((e) => [e.valor, e.label])
);
export const EMOJI_ESPECIE = Object.fromEntries(
  ESPECIES.map((e) => [e.valor, e.emoji])
);
export const ETIQUETA_PROPOSITO = Object.fromEntries(
  PROPOSITOS.map((p) => [p.valor, p.label])
);

// Sugerencia de qué escribir en el campo "raza o tipo" según la especie.
export const PLACEHOLDER_RAZA = {
  bovino: 'Ej: Brahman, Cebú, Gyr, criollo…',
  bufalino: 'Ej: Murrah, Mediterráneo…',
  equino: 'Ej: Paso fino, criollo, cuarto de milla…',
  mular: 'Ej: Mula mular, macho…',
  asnal: 'Ej: Burro criollo…',
  porcino: 'Ej: Landrace, Duroc, criollo…',
  ovino: 'Ej: Katahdin, criollo…',
  caprino: 'Ej: Boer, criolla…',
  aves: 'Ej: Gallinas ponedoras, pollos de engorde, patos, pavos…',
};

// ---- Comisión por especie (animales) ----
// Ganado mayor: 5% (2.5% cada parte). Especies menores: 2% (1% cada parte).
export const COMISION_MAYOR = 5;
export const COMISION_MENOR = 2;
const ESPECIES_MENORES = new Set(['porcino', 'ovino', 'caprino', 'aves']);

export function comisionPorEspecie(especie) {
  return ESPECIES_MENORES.has(especie) ? COMISION_MENOR : COMISION_MAYOR;
}

// ======================= CATEGORÍAS =======================
// Para agregar una categoría nueva: una línea aquí (y su valor en el backend).
export const CATEGORIAS = [
  { valor: 'animales',         label: 'Animales',         emoji: '🐄', activa: true,
    desc: 'Ganado y especies menores' },
  { valor: 'vehiculos',        label: 'Vehículos',        emoji: '🚗', activa: true,
    desc: 'Carros, motos, camionetas, tractores' },
  { valor: 'inmuebles',        label: 'Inmuebles',        emoji: '🏠', activa: true,
    desc: 'Casas, fincas, lotes y locales' },
  { valor: 'electrodomesticos', label: 'Electrodomésticos', emoji: '📺', activa: true,
    desc: 'Neveras, TVs, lavadoras, celulares y más' },
  { valor: 'varios',           label: 'Otros / Varios',   emoji: '📦', activa: true,
    desc: 'Negocios, muebles, herramientas y todo lo demás' },
];

// Grupos opcionales para clasificar los avisos de "Otros / Varios".
export const VARIOS_GRUPOS = [
  { valor: 'negocio',      label: 'Negocio / emprendimiento' },
  { valor: 'muebles',      label: 'Muebles y hogar' },
  { valor: 'herramientas', label: 'Herramientas y maquinaria' },
  { valor: 'ropa',         label: 'Ropa y accesorios' },
  { valor: 'deportes',     label: 'Deportes y recreación' },
  { valor: 'instrumentos', label: 'Instrumentos musicales' },
  { valor: 'agro',         label: 'Insumos agrícolas' },
  { valor: 'otro',         label: 'Otro' },
];
export const LABEL_VARIOS_GRUPO = Object.fromEntries(VARIOS_GRUPOS.map((g) => [g.valor, g.label]));
export const EMOJI_CATEGORIA = Object.fromEntries(CATEGORIAS.map((c) => [c.valor, c.emoji]));
export const LABEL_CATEGORIA = Object.fromEntries(CATEGORIAS.map((c) => [c.valor, c.label]));

// ---- Comisión por categoría ----
// pct = porcentaje total. reparto: 'ambos' = 50/50 comprador/vendedor;
// 'vendedor' = todo lo asume el vendedor (el comprador no paga sobrecosto).
export const COMISION_CATEGORIA = {
  vehiculos: { pct: 5, reparto: 'ambos' },
  inmuebles: { pct: 5, reparto: 'vendedor' },
  electrodomesticos: { pct: 2, reparto: 'vendedor' }, // 2% que asume el vendedor
  varios: { pct: 2, reparto: 'vendedor' },            // 2% que asume el vendedor
};

// Comisión aplicable a una publicación (animales usa su regla por especie).
export function comisionDe(pub) {
  if (!pub || pub.categoria === 'animales') {
    return { pct: comisionPorEspecie(pub && pub.especie), reparto: 'ambos' };
  }
  return COMISION_CATEGORIA[pub.categoria] || { pct: 0, reparto: 'ambos' };
}

// Datos para el cobro de la comisión.
export const NEQUI = '3156009728';

// Cuánto le paga el vendedor a la plataforma por la comisión de su venta.
// reparto 'vendedor' → paga el % completo; 'ambos' → paga su mitad.
export function comisionVendedorPaga(pub, monto) {
  const { pct, reparto } = comisionDe(pub);
  const efectivo = reparto === 'vendedor' ? pct : pct / 2;
  return (parseFloat(monto) || 0) * (efectivo / 100);
}

// Desglose de la comisión sobre un monto, según pct y reparto.
export function desgloseComision(monto, { pct, reparto }) {
  const m = parseFloat(monto) || 0;
  const total = m * (pct / 100);
  if (reparto === 'vendedor') {
    return { pct, reparto, comisionTotal: total, compradorPaga: 0, vendedorCede: total,
             totalComprador: m, recibeVendedor: m - total };
  }
  const cada = total / 2;
  return { pct, reparto, comisionTotal: total, compradorPaga: cada, vendedorCede: cada,
           totalComprador: m + cada, recibeVendedor: m - cada };
}

// ======================= VEHÍCULOS =======================
export const VEHICULO_TIPOS = [
  { valor: 'carro',               label: 'Carro / automóvil' },
  { valor: 'camioneta',           label: 'Camioneta / SUV' },
  { valor: 'van',                 label: 'Van' },
  { valor: 'moto',                label: 'Moto' },
  { valor: 'bus',                 label: 'Bus' },
  { valor: 'buseta',              label: 'Buseta' },
  { valor: 'camion',              label: 'Camión' },
  { valor: 'tractocamion',        label: 'Tractocamión / mula' },
  { valor: 'volqueta',            label: 'Volqueta' },
  { valor: 'tractor',             label: 'Tractor agrícola' },
  { valor: 'maquinaria_amarilla', label: 'Maquinaria amarilla' },
  { valor: 'otro',                label: 'Otro' },
];
export const VEHICULO_TRANSMISION = [
  { valor: '',           label: 'Sin especificar' },
  { valor: 'mecanica',   label: 'Mecánica' },
  { valor: 'automatica', label: 'Automática' },
];
export const VEHICULO_COMBUSTIBLE = [
  { valor: '',           label: 'Sin especificar' },
  { valor: 'gasolina',   label: 'Gasolina' },
  { valor: 'diesel',     label: 'Diésel' },
  { valor: 'gas',        label: 'Gas' },
  { valor: 'electrico',  label: 'Eléctrico / híbrido' },
];
export const LABEL_VEHICULO_TIPO = Object.fromEntries(VEHICULO_TIPOS.map((t) => [t.valor, t.label]));

// ======================= INMUEBLES =======================
export const INMUEBLE_TIPOS = [
  { valor: 'casa',        label: 'Casa' },
  { valor: 'apartamento', label: 'Apartamento' },
  { valor: 'finca',       label: 'Finca' },
  { valor: 'lote',        label: 'Lote / terreno' },
  { valor: 'local',       label: 'Local comercial' },
  { valor: 'bodega',      label: 'Bodega' },
  { valor: 'otro',        label: 'Otro' },
];
export const UNIDADES_AREA = [
  { valor: 'm2',        label: 'm²' },
  { valor: 'hectareas', label: 'hectáreas' },
  { valor: 'fanegadas', label: 'fanegadas' },
];
export const LABEL_INMUEBLE_TIPO = Object.fromEntries(INMUEBLE_TIPOS.map((t) => [t.valor, t.label]));
export const LABEL_UNIDAD = Object.fromEntries(UNIDADES_AREA.map((u) => [u.valor, u.label]));

export const MAX_FOTOS = 10;
