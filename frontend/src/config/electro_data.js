// Marcas de electrodomésticos por tipo. La referencia/modelo va en texto libre
// (hay miles y muy específicas). Siempre hay opción "Otra".

export const OTRA = '__otra__';

export const ELECTRO_TIPOS = [
  { valor: 'televisor',   label: 'Televisor / TV',        cap: 'Ej: 55 pulgadas' },
  { valor: 'nevera',      label: 'Nevera / Refrigerador', cap: 'Ej: 300 litros' },
  { valor: 'lavadora',    label: 'Lavadora',              cap: 'Ej: 10 kg' },
  { valor: 'secadora',    label: 'Secadora',              cap: 'Ej: 10 kg' },
  { valor: 'estufa',      label: 'Estufa / Cocina',       cap: 'Ej: 4 puestos, gas' },
  { valor: 'microondas',  label: 'Microondas / Horno',    cap: 'Ej: 20 litros' },
  { valor: 'aire',        label: 'Aire acondicionado',    cap: 'Ej: 12.000 BTU' },
  { valor: 'ventilador',  label: 'Ventilador',            cap: 'Ej: de pie' },
  { valor: 'licuadora',   label: 'Licuadora / pequeños',  cap: 'Ej: 600 W' },
  { valor: 'sonido',      label: 'Equipo de sonido',      cap: 'Ej: 1000 W' },
  { valor: 'computador',  label: 'Computador / portátil', cap: 'Ej: 8GB RAM, 256GB' },
  { valor: 'celular',     label: 'Celular',               cap: 'Ej: 128 GB' },
  { valor: 'otro',        label: 'Otro',                  cap: 'Capacidad / tamaño' },
];

const GRUPO_POR_TIPO = {
  televisor: 'tv_audio', sonido: 'tv_audio',
  nevera: 'linea_blanca', lavadora: 'linea_blanca', secadora: 'linea_blanca',
  estufa: 'linea_blanca', microondas: 'linea_blanca', aire: 'linea_blanca',
  ventilador: 'pequenos', licuadora: 'pequenos',
  computador: 'computo', celular: 'celular', otro: 'general',
};

export const MARCAS_ELECTRO = {
  tv_audio: ['Samsung', 'LG', 'Sony', 'TCL', 'Hisense', 'Hyundai', 'Kalley', 'Panasonic', 'Philips', 'Challenger', 'AOC', 'Caixun', 'Sankey', 'JBL', 'Bose'],
  linea_blanca: ['Mabe', 'Haceb', 'LG', 'Samsung', 'Whirlpool', 'Electrolux', 'Challenger', 'Frigidaire', 'Abba', 'Indurama', 'Centrales', 'Bosch', 'Hyundai', 'Kalley', 'Oster', 'General Electric'],
  pequenos: ['Oster', 'Imusa', 'Universal', 'Black+Decker', 'Philips', 'Hamilton Beach', 'Kalley', 'Samurai', 'Landers', 'Haceb', 'Challenger', 'Sindelen'],
  computo: ['HP', 'Lenovo', 'Dell', 'Asus', 'Acer', 'Apple', 'MSI', 'Compumax', 'Toshiba', 'Huawei'],
  celular: ['Samsung', 'Apple', 'Xiaomi', 'Motorola', 'Huawei', 'Honor', 'Oppo', 'Realme', 'ZTE', 'Nokia', 'Tecno', 'Infinix'],
  general: ['Samsung', 'LG', 'Mabe', 'Haceb', 'Whirlpool', 'Electrolux', 'Challenger', 'Kalley', 'Oster', 'Sony', 'Philips', 'Universal'],
};

export const ELECTRO_ESTADOS = [
  { valor: 'nuevo', label: 'Nuevo' },
  { valor: 'usado', label: 'Usado' },
];

export const LABEL_ELECTRO_TIPO = Object.fromEntries(ELECTRO_TIPOS.map((t) => [t.valor, t.label]));
export const CAP_ELECTRO_TIPO = Object.fromEntries(ELECTRO_TIPOS.map((t) => [t.valor, t.cap]));

export function marcasElectroDe(tipo) {
  return MARCAS_ELECTRO[GRUPO_POR_TIPO[tipo] || 'general'] || MARCAS_ELECTRO.general;
}
