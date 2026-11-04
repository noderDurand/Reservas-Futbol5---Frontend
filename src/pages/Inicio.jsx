import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Inicio() {
  const { usuario } = useAuth()
  return (
    <section>
      <h1>Hola, {usuario.name}</h1>
      <p>¿Listo para jugar?</p>
      <Link to="/reservar" className="boton">Reservar un turno</Link>
    </section>
  )
}
