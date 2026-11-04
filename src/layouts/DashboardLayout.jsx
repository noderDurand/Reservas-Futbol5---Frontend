import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import logo from '../assets/logo.png'

export default function DashboardLayout() {
  const { usuario, logout } = useAuth()
  const [saliendo, setSaliendo] = useState(false)

  async function salir() {
    setSaliendo(true)
    await logout() // al quedar sin usuario, RutaProtegida redirige a /login
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <img src={logo} alt="Fútbol 5" className="sidebar-logo" />

        <nav className="sidebar-nav" aria-label="Principal">
          <NavLink to="/" end><span aria-hidden="true">🏠</span> Inicio</NavLink>
          <NavLink to="/reservar"><span aria-hidden="true">⚽</span> Reservar</NavLink>
          <NavLink to="/mis-reservas"><span aria-hidden="true">📋</span> Mis reservas</NavLink>
        </nav>

        <div className="sidebar-usuario">
          <span>{usuario.name}</span>
          <button type="button" className="boton boton-secundario" onClick={salir} disabled={saliendo}>
            {saliendo ? 'Saliendo…' : 'Salir'}
          </button>
        </div>
      </aside>

      <main className="contenido">
        <Outlet />
      </main>
    </div>
  )
}
