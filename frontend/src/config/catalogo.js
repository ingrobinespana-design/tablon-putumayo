// Catálogo de especies y propósitos del Tablón.
// Para agregar una especie nueva en el futuro, basta con añadir una línea aquí
// (y el mismo valor en EspecieEnum del backend). Todo lo demás se adapta solo.

export const ESPECIES = [
  { valor: 'bovino',   label: 'Bovinos',        singular: 'Bovino'  },
  { valor: 'bufalino', label: 'Búfalos',        singular: 'Búfalo'  },
  { valor: 'equino',   label: 'Caballos',       singular: 'Caballo' },
  { valor: 'mular',    label: 'Mulas y machos', singular: 'Mular'   },
  { valor: 'asnal',    label: 'Burros',         singular: 'Burro'   },
  { valor: 'porcino',  label: 'Cerdos',         singular: 'Cerdo'   },
  { valor: 'ovino',    label: 'Ovejas',         singular: 'Oveja'   },
  { valor: 'caprino',  label: 'Cabras',         singular: 'Cabra'   },
  { valor: 'aves',     label: 'Aves de corral', singular: 'Aves'    },
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

// ---- Comisión por especie ----
// Ganado mayor: 5% (2.5% cada parte). Especies menores: 2% (1% cada parte).
export const COMISION_MAYOR = 5;
export const COMISION_MENOR = 2;
const ESPECIES_MENORES = new Set(['porcino', 'ovino', 'caprino', 'aves']);

export function comisionPorEspecie(especie) {
  return ESPECIES_MENORES.has(especie) ? COMISION_MENOR : COMISION_MAYOR;
}
