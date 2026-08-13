import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Encabezado from './components/Encabezado';
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import DetalleAnimal from './pages/DetalleAnimal';
import PublicarAnimal from './pages/PublicarAnimal';
import CatalogoVehiculos from './pages/CatalogoVehiculos';
import DetalleVehiculo from './pages/DetalleVehiculo';
import PublicarVehiculo from './pages/PublicarVehiculo';
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
            </Routes>
          </>
        }
      />
    </Routes>
  );
}
