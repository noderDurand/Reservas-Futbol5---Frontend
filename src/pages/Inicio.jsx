import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Inicio() {
  const { usuario } = useAuth()
  return (
    <section>
      <h1>Hola, {usuario.name}</h1>
      <p>¿Listo para jugar?</p>
      <div className='grid-card'>
        <Link to="/reservar" className="card-inicio">
          <span aria-hidden="true" className='card-inicio-icon'>⚽</span>
          <strong>Reservá tu turno</strong>
          <span>Elegi cancha, fecha y horario.</span>
        </Link>

        <Link to="/mis-reservas" className='card-inicio'>
          <span aria-hidden="true" className='card-inicio-icon'></span>
          <strong>Ver tus Reservas</strong>
          <span>Consultá o cancela tus reservas.</span>
        </Link>
      </div>
    </section>
  )
}
