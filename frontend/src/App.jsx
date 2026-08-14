import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Encabezado from './components/Encabezado';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import DetalleAnimal from './pages/DetalleAnimal';
import PublicarAnimal from './pages/PublicarAnimal';
import CatalogoVehiculos from './pages/CatalogoVehiculos';
import DetalleVehiculo from './pages/DetalleVehiculo';
import PublicarVehiculo from './pages/PublicarVehiculo';
import CatalogoInmuebles from './pages/CatalogoInmuebles';
import DetalleInmueble from './pages/DetalleInmueble';
import PublicarInmueble from './pages/PublicarInmueble';
import CatalogoElectro from './pages/CatalogoElectro';
import DetalleElectro from './pages/DetalleElectro';
import PublicarElectro from './pages/PublicarElectro';
import CatalogoVarios from './pages/CatalogoVarios';
import DetalleVarios from './pages/DetalleVarios';
import PublicarVarios from './pages/PublicarVarios';
import GestionAviso from './pages/GestionAviso';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      <RutasConEncabezado />
    </BrowserRouter>
  );
}

function RutasConEncabezado() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/panel" element={<AdminPanel />} />
      <Route
        path="/*"
        element={
          <>
            <Encabezado />
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/publicar" element={<Inicio modo="publicar" />} />

              {/* Animales */}
              <Route path="/animales" element={<Catalogo />} />
              <Route path="/animal/:id" element={<DetalleAnimal />} />
              <Route path="/publicar/animales" element={<PublicarAnimal />} />

              {/* Vehículos */}
              <Route path="/vehiculos" element={<CatalogoVehiculos />} />
              <Route path="/vehiculo/:id" element={<DetalleVehiculo />} />
              <Route path="/publicar/vehiculos" element={<PublicarVehiculo />} />

              {/* Inmuebles */}
              <Route path="/inmuebles" element={<CatalogoInmuebles />} />
              <Route path="/inmueble/:id" element={<DetalleInmueble />} />
              <Route path="/publicar/inmuebles" element={<PublicarInmueble />} />

              {/* Electrodomésticos */}
              <Route path="/electrodomesticos" element={<CatalogoElectro />} />
              <Route path="/electrodomestico/:id" element={<DetalleElectro />} />
              <Route path="/publicar/electrodomesticos" element={<PublicarElectro />} />

              {/* Otros / Varios */}
              <Route path="/varios" element={<CatalogoVarios />} />
              <Route path="/articulo/:id" element={<DetalleVarios />} />
              <Route path="/publicar/varios" element={<PublicarVarios />} />

              {/* Gestión del vendedor (enlace privado) */}
              <Route path="/gestionar/:token" element={<GestionAviso />} />
            </Routes>
          </>
        }
      />
    </Routes>
  );
}
