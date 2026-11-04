import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import Cargando from './Cargando'

export default function RutaProtegida() {
    const { usuario, cargando } = useAuth()
    const location = useLocation()

    if (cargando) return <Cargando texto="Verificando sesión…" />
    // Guardamos a dónde quería ir, para volver ahí después del login
    if (!usuario) return <Navigate to="/login" replace state={{ desde: location }} />
    return <Outlet />
}
