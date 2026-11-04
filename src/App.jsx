import { Route, Routes } from 'react-router-dom'
import RutaProtegida from './components/RutaProtegida'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Inicio from './pages/Inicio'
import Reservar from './pages/Reservar'
import MisReservas from './pages/MisReservas'
import NoEncontrada from './pages/NoEncontrada'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route element={<RutaProtegida />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Inicio />} />
          <Route path="reservar" element={<Reservar />} />
          <Route path="mis-reservas" element={<MisReservas />} />
        </Route>
      </Route>

      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  )
}
