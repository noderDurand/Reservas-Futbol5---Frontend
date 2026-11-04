import { Link } from 'react-router-dom'

export default function NoEncontrada() {
  return (
    <main className="auth">
      <div className="auth-tarjeta">
        <h1>Página no encontrada</h1>
        <p>La dirección que buscás no existe.</p>
        <Link to="/" className="boton">Volver al inicio</Link>
      </div>
    </main>
  )
}
