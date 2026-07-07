import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Encabezado from './components/Encabezado';
import Catalogo from './pages/Catalogo';
import DetalleAnimal from './pages/DetalleAnimal';
import PublicarAnimal from './pages/PublicarAnimal';
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
              <Route path="/" element={<Catalogo />} />
              <Route path="/animal/:id" element={<DetalleAnimal />} />
              <Route path="/publicar" element={<PublicarAnimal />} />
            </Routes>
          </>
        }
      />
    </Routes>
  );
}
