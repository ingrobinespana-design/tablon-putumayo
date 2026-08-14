// Marcas y líneas de vehículos comunes en Colombia.
// Las líneas dependen del TIPO (grupo) y la MARCA — así una misma marca
// (Chevrolet, Honda, Suzuki…) muestra líneas distintas según sea auto, moto
// o pesado. Siempre hay opción "Otra" con texto libre.

export const OTRA = '__otra__';

// Grupo de marcas/líneas según el tipo de vehículo.
const GRUPO_POR_TIPO = {
  carro: 'auto',
  camioneta: 'auto',
  van: 'auto',
  otro: 'auto',
  moto: 'moto',
  bus: 'pesados',
  buseta: 'pesados',
  camion: 'pesados',
  tractocamion: 'pesados',
  volqueta: 'pesados',
  tractor: 'agricola',
  maquinaria_amarilla: 'maquinaria',
};

export const MARCAS = {
  auto: [
    'Chevrolet', 'Renault', 'Kia', 'Nissan', 'Mazda', 'Toyota', 'Hyundai', 'Suzuki',
    'Volkswagen', 'Ford', 'Mitsubishi', 'Peugeot', 'Citroën', 'Fiat', 'Honda', 'JAC',
    'Chery', 'Changan', 'BYD', 'GWM (Great Wall)', 'SsangYong', 'Jeep', 'Subaru',
    'DFSK', 'Foton', 'Dodge', 'RAM', 'Chrysler', 'Land Rover', 'MINI', 'Volvo',
    'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Porsche', 'Skoda', 'Seat', 'Opel',
  ],
  moto: [
    'Yamaha', 'Honda', 'Bajaj', 'AKT', 'Suzuki', 'Hero', 'TVS', 'Kawasaki', 'KTM',
    'Victory', 'Royal Enfield', 'Benelli', 'Kymco', 'UM', 'CFMoto', 'Auteco',
    'Ducati', 'Harley-Davidson', 'BMW Motorrad', 'Triumph', 'Aprilia', 'Husqvarna',
    'Vespa', 'SYM', 'Aima', 'Starker', 'Sunra',
  ],
  pesados: [
    'Chevrolet', 'Hino', 'Isuzu', 'JAC', 'Foton', 'Dongfeng', 'International',
    'Kenworth', 'Freightliner', 'Mack', 'Volvo', 'Mercedes-Benz', 'Scania', 'Iveco',
    'MAN', 'DAF', 'Agrale', 'Dina', 'Volkswagen', 'Sinotruk', 'Shacman', 'FAW',
    'Nissan', 'Marcopolo', 'Busscar',
  ],
  agricola: [
    'John Deere', 'Massey Ferguson', 'New Holland', 'Kubota', 'Case IH', 'Landini',
    'Valtra', 'Fendt', 'Deutz-Fahr', 'Mahindra', 'Kioti', 'Yanmar', 'Same',
  ],
  maquinaria: [
    'Caterpillar', 'Komatsu', 'John Deere', 'JCB', 'Case', 'Volvo', 'Hyundai',
    'Doosan', 'Hitachi', 'Liebherr', 'XCMG', 'SANY', 'Bobcat', 'New Holland',
    'Kobelco', 'Terex', 'LiuGong', 'Kubota',
  ],
};

// Líneas por grupo y marca.
export const LINEAS = {
  auto: {
    Chevrolet: ['Spark', 'Spark GT', 'Spark Life', 'Beat', 'Sail', 'Onix', 'Onix Turbo', 'Aveo', 'Cruze', 'Malibú', 'Tracker', 'Captiva', 'Equinox', 'Blazer', 'Trailblazer', 'Traverse', 'Tahoe', 'Colorado', 'D-Max', 'Luv', 'S10', 'Montana', 'N300', 'N400', 'Joy', 'Groove', 'Camaro'],
    Renault: ['Twingo', 'Clio', 'Sandero', 'Sandero Stepway', 'Symbol', 'Logan', 'Stepway', 'Kwid', 'Kwid E-Tech', 'Duster', 'Duster Oroch', 'Captur', 'Koleos', 'Oroch', 'Alaskan', 'Kangoo', 'Kardian', 'Mégane', 'Fluence', 'Trafic'],
    Kia: ['Picanto', 'Rio', 'Soluto', 'Cerato', 'K3', 'Forte', 'Sportage', 'Sorento', 'Seltos', 'Carens', 'Carnival', 'Niro', 'Stonic', 'Soul', 'Mohave', 'Frontier'],
    Nissan: ['March', 'Versa', 'Sentra', 'Almera', 'Kicks', 'Qashqai', 'X-Trail', 'Murano', 'Pathfinder', 'Frontier', 'Navara', 'NP300', 'Note', 'Leaf', 'Patrol', 'Urvan'],
    Mazda: ['Mazda 2', 'Mazda 3', 'Mazda 6', 'CX-3', 'CX-30', 'CX-5', 'CX-50', 'CX-9', 'CX-90', 'BT-50', 'MX-5'],
    Toyota: ['Yaris', 'Yaris Cross', 'Corolla', 'Corolla Cross', 'Camry', 'RAV4', 'Prado', 'Fortuner', 'Hilux', 'Land Cruiser', 'Land Cruiser 200', '4Runner', 'Rush', 'Raize', 'Hiace', 'Tacoma', 'FJ Cruiser', 'Prius'],
    Hyundai: ['Grand i10', 'i10', 'Accent', 'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Creta', 'Kona', 'Venue', 'Palisade', 'i20', 'i30', 'H1', 'Staria', 'Porter'],
    Suzuki: ['Alto', 'Celerio', 'Swift', 'Baleno', 'Ciaz', 'Vitara', 'Grand Vitara', 'S-Cross', 'Jimny', 'Ertiga', 'XL7', 'APV'],
    Volkswagen: ['Gol', 'Voyage', 'Polo', 'Virtus', 'Vento', 'Jetta', 'Passat', 'Golf', 'Scirocco', 'Beetle', 'T-Cross', 'Nivus', 'Taos', 'Tiguan', 'Touareg', 'Amarok', 'Saveiro'],
    Ford: ['Fiesta', 'Focus', 'Ka', 'Mondeo', 'EcoSport', 'Escape', 'Kuga', 'Edge', 'Explorer', 'Expedition', 'Bronco', 'Bronco Sport', 'Territory', 'Ranger', 'F-150', 'F-250', 'Maverick', 'Transit', 'Mustang'],
    Mitsubishi: ['Mirage', 'Lancer', 'ASX', 'Eclipse Cross', 'Outlander', 'Montero', 'Montero Sport', 'L200', 'Xpander', 'Xpander Cross'],
    Peugeot: ['208', '301', '308', '408', '2008', '3008', '5008', 'Partner', 'Rifter', 'Expert', 'Landtrek'],
    'Citroën': ['C3', 'C3 Aircross', 'C4', 'C4 Cactus', 'C5 Aircross', 'Berlingo', 'Jumpy'],
    Fiat: ['Uno', 'Palio', 'Argo', 'Cronos', 'Mobi', 'Pulse', 'Fastback', 'Toro', 'Fiorino', 'Strada', 'Ducato'],
    Honda: ['Fit', 'City', 'Civic', 'Accord', 'HR-V', 'CR-V', 'BR-V', 'WR-V', 'Pilot', 'Odyssey', 'Ridgeline'],
    JAC: ['J2', 'J3', 'J4', 'J7', 'S2', 'S3', 'S4', 'S7', 'T6', 'T8', 'E10X', 'Sunray'],
    Chery: ['QQ', 'Tiggo 2', 'Tiggo 3', 'Tiggo 4', 'Tiggo 5', 'Tiggo 7', 'Tiggo 8', 'Arrizo 5', 'Arrizo 6', 'Omoda 5'],
    Changan: ['Alsvin', 'Eado', 'CS15', 'CS35', 'CS55', 'CS75', 'CS85', 'Hunter', 'Uni-T', 'Uni-K', 'Star'],
    BYD: ['F0', 'Dolphin', 'Seal', 'Yuan Plus', 'Yuan Pro', 'Song Plus', 'Song Pro', 'Tang', 'Han', 'Shark'],
    'GWM (Great Wall)': ['Wingle 5', 'Wingle 7', 'Poer', 'Haval H6', 'Haval Jolion', 'Haval H2', 'Tank 300', 'Tank 500', 'Ora 03'],
    SsangYong: ['Tivoli', 'Korando', 'Rexton', 'Musso', 'Actyon'],
    Subaru: ['Impreza', 'XV', 'Crosstrek', 'Forester', 'Outback', 'Legacy', 'WRX'],
    DFSK: ['Glory', 'Glory 500', 'Glory 580', 'K01', 'K05', 'Mini Truck', 'Van'],
    Foton: ['Tunland', 'View', 'Toano', 'Gratour'],
    Dodge: ['Journey', 'Durango', 'Charger', 'Challenger', 'Ram'],
    RAM: ['700', '1000', '1200', '1500', '2500', '3500'],
    'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar', 'Freelander'],
    MINI: ['Cooper', 'Cooper S', 'Countryman', 'Clubman', 'Paceman'],
    Volvo: ['S60', 'S90', 'V40', 'XC40', 'XC60', 'XC90', 'C40'],
    BMW: ['Serie 1', 'Serie 2', 'Serie 3', 'Serie 4', 'Serie 5', 'Serie 7', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'M2', 'M3', 'M4', 'iX'],
    'Mercedes-Benz': ['Clase A', 'Clase B', 'Clase C', 'Clase E', 'Clase S', 'CLA', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'Clase G'],
    Audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'e-tron'],
    Lexus: ['UX', 'NX', 'RX', 'GX', 'LX', 'ES', 'IS'],
  },
  moto: {
    Yamaha: ['FZ', 'FZ 2.0', 'FZ 25', 'YBR', 'YBR 125', 'XTZ', 'XTZ 125', 'XTZ 150', 'XTZ 250', 'MT-03', 'MT-07', 'MT-09', 'R3', 'R15', 'NMAX', 'Aerox', 'BWS', 'Crypton', 'Fazer', 'SZ', 'Ténéré', 'FZ-X'],
    Honda: ['CB110', 'CB125', 'CB125F', 'CB160F', 'CB190R', 'CB250', 'CB500', 'XR150', 'XR190', 'XRE300', 'Tornado', 'Navi', 'Dio', 'Elite', 'PCX', 'CRF250', 'Africa Twin', 'Wave', 'Biz'],
    Bajaj: ['Boxer', 'Boxer CT100', 'Pulsar 125', 'Pulsar 135', 'Pulsar 150', 'Pulsar 180', 'Pulsar NS160', 'Pulsar NS200', 'Pulsar N250', 'Discover', 'Platina', 'Dominar 250', 'Dominar 400', 'Avenger'],
    AKT: ['NKD 125', 'Flex', 'TT 125', 'TT 150', 'Dynamic', 'Dynamic Pro', 'CR4', 'CR5', 'SL', 'Special', 'AK 125', 'AK 150', 'AK 180', 'RTX', 'Evo'],
    Suzuki: ['GN125', 'EN125', 'Gixxer', 'Gixxer 150', 'Gixxer 250', 'GSX-R150', 'GSX-S150', 'V-Strom 250', 'V-Strom 650', 'DR200', 'DR650', 'Best', 'AX4', 'Address', 'Burgman'],
    Hero: ['Eco Deluxe', 'Splendor', 'Hunk', 'Hunk 190R', 'Ignitor', 'Dash', 'Xpulse 200', 'Thriller', 'Glamour', 'Xtreme'],
    TVS: ['Apache RTR 160', 'Apache RTR 180', 'Apache RTR 200', 'Sport', 'Star', 'Raider', 'Ntorq', 'Neo'],
    Kawasaki: ['Ninja 300', 'Ninja 400', 'Ninja 650', 'Z400', 'Z650', 'Z900', 'KLR 650', 'Versys 300', 'Versys 650', 'Vulcan'],
    KTM: ['Duke 200', 'Duke 250', 'Duke 390', 'RC 200', 'RC 390', 'Adventure 250', 'Adventure 390', '790 Adventure'],
    Victory: ['One', 'Bomber', 'MRX', 'Nitro', 'Zam', 'Switch', 'Advance'],
    'Royal Enfield': ['Classic 350', 'Meteor 350', 'Hunter 350', 'Himalayan', 'Scram 411', 'Interceptor 650', 'Continental GT 650'],
    Benelli: ['TNT 15', 'TNT 25', 'TNT 135', '180S', '302S', 'Leoncino', 'TRK 251', 'TRK 502', 'Imperiale 400'],
  },
  pesados: {
    Chevrolet: ['NHR', 'NKR', 'NPR', 'NPR Reward', 'FRR', 'FVR', 'FTR', 'Kodiak'],
    Hino: ['300', '500', '700', 'Dutro'],
    Isuzu: ['NHR', 'NKR', 'NPR', 'NQR', 'FTR', 'FVR', 'FRR'],
    Foton: ['Aumark', 'Ollin', 'Auman', 'View Traveller'],
    International: ['DuraStar', 'WorkStar', 'ProStar', 'HV', 'MV', '4300', '9200'],
    Kenworth: ['T800', 'T680', 'W900', 'T880', 'C500'],
    Freightliner: ['Cascadia', 'Columbia', 'M2', 'Business Class', 'Cargo'],
    Volvo: ['FH', 'FM', 'FMX', 'VM', 'B7R', 'B9R', 'B11R', 'B290R', 'B380'],
    'Mercedes-Benz': ['Accelo', 'Atego', 'Axor', 'Actros', 'OF', 'OH', 'LO', 'Sprinter'],
    Volkswagen: ['Delivery', 'Constellation', 'Worker', 'Volksbus'],
    JAC: ['1040', '1042', '1063', 'X200', 'Gallop', 'Sunray'],
    Dongfeng: ['Captain', 'Kingland', 'Duolika'],
    MAN: ['TGX', 'TGS', 'TGM', 'TGL'],
    DAF: ['XF', 'CF', 'LF'],
    Scania: ['R', 'P', 'G', 'K'],
    Iveco: ['Daily', 'Tector', 'Trakker', 'Stralis'],
    Sinotruk: ['Howo', 'Sitrak'],
    Shacman: ['X3000', 'F3000'],
    FAW: ['J6', 'Tiger'],
    Agrale: ['MA', 'MT'],
    Nissan: ['UD', 'Cabstar', 'Frontier'],
  },
  agricola: {
    'John Deere': ['5055E', '5075E', '5090E', '5100E', '6110', '6120', '6145'],
    'Massey Ferguson': ['MF 240', 'MF 260', 'MF 290', 'MF 4707', 'MF 4709'],
    'New Holland': ['TT4', 'TD5', 'TS6', 'Workmaster'],
    Kubota: ['L3408', 'MU4501', 'M7040'],
  },
  maquinaria: {
    Caterpillar: ['320', '336', '420', '966', 'D6', 'D8', '140', '950', '424'],
    Komatsu: ['PC200', 'PC300', 'D65', 'WA320', 'GD555'],
    JCB: ['3CX', '4CX', 'JS200', '426', 'Loadall'],
    'John Deere': ['310', '410', '644', '724'],
  },
};

// Marcas para un tipo de vehículo (con "Otra" al final la agrega el formulario).
export function marcasDe(tipo) {
  const grupo = GRUPO_POR_TIPO[tipo] || 'auto';
  return MARCAS[grupo] || MARCAS.auto;
}

// Líneas de una marca SEGÚN el tipo (vacío → se usa texto libre).
export function lineasDe(marca, tipo) {
  const grupo = GRUPO_POR_TIPO[tipo] || 'auto';
  const porGrupo = LINEAS[grupo] || {};
  return porGrupo[marca] || [];
}
