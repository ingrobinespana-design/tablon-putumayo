// Catálogo de especies y propósitos del Tablón.
// Para agregar una especie nueva en el futuro, basta con añadir una línea aquí
// (y el mismo valor en EspecieEnum del backend). Todo lo demás se adapta solo.

export const ESPECIES = [
  { valor: 'bovino',   label: 'Bovinos',        singular: 'Bovino',  emoji: '🐮' },
  { valor: 'bufalino', label: 'Búfalos',        singular: 'Búfalo',  emoji: '🐃' },
  { valor: 'equino',   label: 'Caballos',       singular: 'Caballo', emoji: '🐴' },
  { valor: 'mular',    label: 'Mulas y machos', singular: 'Mular',   emoji: '🐴' },
  { valor: 'asnal',    label: 'Burros',         singular: 'Burro',   emoji: '🫏' },
  { valor: 'porcino',  label: 'Cerdos',         singular: 'Cerdo',   emoji: '🐷' },
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
