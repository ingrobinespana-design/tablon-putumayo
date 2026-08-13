// Marcas y líneas de vehículos comunes en Colombia.
// La línea (modelo) depende de la marca seleccionada. Siempre hay opción "Otra"
// con campo de texto libre, así que la lista no tiene que ser exhaustiva.

export const OTRA = '__otra__';

// Qué grupo de marcas aplica según el tipo de vehículo.
const GRUPO_POR_TIPO = {
  carro: 'auto',
  camioneta: 'auto',
  bus: 'auto',
  camion: 'camion',
  moto: 'moto',
  tractor: 'tractor',
  otro: 'auto',
};

export const MARCAS = {
  auto: [
    'Chevrolet', 'Renault', 'Kia', 'Nissan', 'Mazda', 'Toyota', 'Hyundai', 'Suzuki',
    'Volkswagen', 'Ford', 'Mitsubishi', 'Peugeot', 'Citroën', 'Fiat', 'Honda', 'JAC',
    'Chery', 'Changan', 'BYD', 'GWM (Great Wall)', 'SsangYong', 'Jeep', 'Subaru',
    'BMW', 'Mercedes-Benz', 'Audi', 'Volvo',
  ],
  moto: [
    'Yamaha', 'Honda', 'Bajaj', 'AKT', 'Suzuki', 'Hero', 'TVS', 'Kawasaki', 'KTM',
    'Victory', 'Royal Enfield', 'Benelli', 'Kymco', 'UM', 'CFMoto', 'Auteco',
  ],
  camion: [
    'Chevrolet', 'Hino', 'Isuzu', 'JAC', 'Foton', 'Dongfeng', 'International',
    'Kenworth', 'Freightliner', 'Mack', 'Volvo', 'Mercedes-Benz', 'Scania', 'Iveco',
  ],
  tractor: [
    'John Deere', 'Kubota', 'Massey Ferguson', 'New Holland', 'Case IH', 'Landini',
    'Valtra', 'Fendt', 'JCB', 'Caterpillar',
  ],
};

export const LINEAS = {
  // ---- Autos ----
  Chevrolet: ['Spark', 'Spark GT', 'Beat', 'Sail', 'Onix', 'Aveo', 'Cruze', 'Tracker', 'Captiva', 'Equinox', 'Trailblazer', 'Colorado', 'D-Max', 'N300', 'N400', 'Joy'],
  Renault: ['Twingo', 'Clio', 'Sandero', 'Symbol', 'Logan', 'Stepway', 'Kwid', 'Duster', 'Captur', 'Koleos', 'Oroch', 'Alaskan', 'Kangoo', 'Mégane'],
  Kia: ['Picanto', 'Rio', 'Soluto', 'Cerato', 'Sportage', 'Sorento', 'Seltos', 'Carens', 'Niro', 'Stonic'],
  Nissan: ['March', 'Versa', 'Sentra', 'Kicks', 'Qashqai', 'X-Trail', 'Frontier', 'Pathfinder', 'Note'],
  Mazda: ['Mazda 2', 'Mazda 3', 'Mazda 6', 'CX-3', 'CX-30', 'CX-5', 'CX-9', 'BT-50'],
  Toyota: ['Yaris', 'Corolla', 'Corolla Cross', 'RAV4', 'Prado', 'Fortuner', 'Hilux', 'Land Cruiser', '4Runner', 'Rush', 'Raize'],
  Hyundai: ['Grand i10', 'Accent', 'Elantra', 'Tucson', 'Santa Fe', 'Creta', 'Kona', 'Venue', 'i20'],
  Suzuki: ['Alto', 'Celerio', 'Swift', 'Baleno', 'Ciaz', 'Vitara', 'S-Cross', 'Jimny', 'Ertiga'],
  Volkswagen: ['Gol', 'Polo', 'Virtus', 'Vento', 'Jetta', 'T-Cross', 'Tiguan', 'Amarok', 'Nivus', 'Saveiro'],
  Ford: ['Fiesta', 'Focus', 'EcoSport', 'Escape', 'Explorer', 'Ranger', 'F-150', 'Territory', 'Bronco'],
  Mitsubishi: ['Mirage', 'Lancer', 'ASX', 'Outlander', 'Montero', 'L200', 'Xpander'],
  Peugeot: ['208', '301', '2008', '3008', '5008', 'Partner', 'Landtrek'],
  'Citroën': ['C3', 'C4 Cactus', 'C5 Aircross', 'Berlingo'],
  Fiat: ['Uno', 'Palio', 'Argo', 'Cronos', 'Mobi', 'Toro', 'Fiorino', 'Strada'],
  Honda: ['Fit', 'City', 'Civic', 'HR-V', 'CR-V', 'BR-V', 'Pilot'],
  JAC: ['J2', 'J3', 'J4', 'S2', 'S3', 'T6', 'T8'],
  Chery: ['QQ', 'Tiggo 2', 'Tiggo 4', 'Tiggo 7', 'Tiggo 8', 'Arrizo 5'],
  Changan: ['Alsvin', 'CS15', 'CS35', 'CS55', 'Hunter'],
  BYD: ['F0', 'Dolphin', 'Yuan Plus', 'Song Plus', 'Han'],
  'GWM (Great Wall)': ['Wingle', 'Poer', 'Haval H6', 'Haval Jolion', 'Ora'],
  SsangYong: ['Tivoli', 'Korando', 'Rexton', 'Musso'],
  Jeep: ['Renegade', 'Compass', 'Wrangler', 'Cherokee', 'Grand Cherokee', 'Commander'],
  // ---- Motos ----
  Yamaha: ['FZ', 'YBR', 'XTZ', 'MT', 'R15', 'NMAX', 'BWS', 'Crypton', 'Fazer', 'SZ'],
  Bajaj: ['Boxer', 'Pulsar', 'Discover', 'Platina', 'Dominar', 'Avenger'],
  AKT: ['NKD', 'Flex', 'TT', 'Dynamic', 'CR4', 'SL', 'Special', 'AK 125', 'AK 150', 'AK 180'],
  Hero: ['Eco Deluxe', 'Hunk', 'Ignitor', 'Dash', 'Xpulse', 'Thriller'],
  TVS: ['Apache', 'Sport', 'Star', 'Raider', 'Ntorq'],
  Kawasaki: ['Ninja', 'Z', 'KLR', 'Versys'],
  KTM: ['Duke', 'RC', 'Adventure'],
  Victory: ['One', 'Bomber', 'MRX', 'Nitro', 'Zam'],
  'Royal Enfield': ['Classic', 'Meteor', 'Himalayan', 'Hunter', 'Interceptor'],
  // ---- Camiones ----
  Hino: ['300', '500', 'Dutro'],
  Isuzu: ['NPR', 'NQR', 'FTR', 'FVR'],
  Foton: ['Aumark', 'Ollin', 'Auman'],
};

// Marcas para un tipo de vehículo (con "Otra" al final).
export function marcasDe(tipo) {
  const grupo = GRUPO_POR_TIPO[tipo] || 'auto';
  return MARCAS[grupo] || MARCAS.auto;
}

// Líneas de una marca (vacío si no hay lista → se usa texto libre).
export function lineasDe(marca) {
  return LINEAS[marca] || [];
}
