import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import MensajeError from '../components/MensajeError'
import logo from '../assets/logo.png'

const FORM_INICIAL = { name: '', email: '', password: '', password_confirmation: '' }

function validar(form) {
  if (!form.name.trim()) return 'Ingresá tu nombre.'
  if (!form.email.trim()) return 'Ingresá tu email.'
  if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
  if (form.password !== form.password_confirmation) return 'Las contraseñas no coinciden.'
  return null
}

export default function Registro() {
  const { usuario, registro } = useAuth()
  const [form, setForm] = useState(FORM_INICIAL)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  if (usuario) return <Navigate to="/" replace />

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function manejarSubmit(e) {
    e.preventDefault()
    const errorValidacion = validar(form)
    if (errorValidacion) {
      setError(errorValidacion)
      return
    }
    setError(null)
    setEnviando(true)
    try {
      await registro({ ...form, name: form.name.trim(), email: form.email.trim() })
    } catch (err) {
      setError(err.message) // ej: "Email has already been taken" desde la API
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="auth">
      <form className="auth-tarjeta" onSubmit={manejarSubmit}>
        <img src={logo} alt="Fútbol 5" className="auth-logo" />
        <h1>Crear cuenta</h1>

        {error && <MensajeError mensaje={error} />}

        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" autoComplete="name" required
          value={form.name} onChange={cambiar} />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required
          value={form.email} onChange={cambiar} />

        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" autoComplete="new-password" required
          value={form.password} onChange={cambiar} />

        <label htmlFor="password_confirmation">Repetir contraseña</label>
        <input id="password_confirmation" name="password_confirmation" type="password"
          autoComplete="new-password" required
          value={form.password_confirmation} onChange={cambiar} />

        <button type="submit" className="boton" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Registrarme'}
        </button>

        <p>¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></p>
      </form>
    </main>
  )
}
