import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import MensajeError from '../components/MensajeError'
import logo from '../assets/logo.png'

export default function Login() {
  const { usuario, login } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // Ya logueado (o recién logueado): lo mandamos a donde quería ir
  if (usuario) return <Navigate to={location.state?.desde?.pathname || '/'} replace />

  async function manejarSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Completá el email y la contraseña.')
      return
    }
    setError(null)
    setEnviando(true)
    try {
      await login(email.trim(), password)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="auth">
      <form className="auth-tarjeta" onSubmit={manejarSubmit}>
        <img src={logo} alt="Fútbol 5" className="auth-logo" />
        <h1>Iniciar sesión</h1>

        {error && <MensajeError mensaje={error} />}

        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" required
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" autoComplete="current-password" required
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit" className="boton" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>

        <p>¿No tenés cuenta? <Link to="/registro">Registrate</Link></p>
      </form>
    </main>
  )
}
