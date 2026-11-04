import { useState, useEffect } from 'react'
import { listarCanchas, turnosDisponibles } from '../api/canchas'
import { crearReserva } from '../api/reservas'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'

const HOY = new Date().toISOString().split('T')[0]

export default function Reservar() {
  
  const [canchas, setCanchas] = useState([])
  const [cargandoCanchas, setCargandoCanchas] = useState(true)
  const [errorCanchas, setErrorCanchas] = useState(null)
  const [canchaId, setCanchaId] = useState(null)

  // --- paso 2: elegir fecha y turno ---
  const [fecha, setFecha] = useState(HOY)
  const [turnos, setTurnos] = useState([])
  const [cargandoTurnos, setCargandoTurnos] = useState(false)
  const [errorTurnos, setErrorTurnos] = useState(null)
  const [turnoId, setTurnoId] = useState(null)

  // --- paso 3: confirmar ---
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState(null)

  // Cargar canchas al montar
  useEffect(() => {
    listarCanchas()
      .then(setCanchas)
      .catch((e) => setErrorCanchas(e.message))
      .finally(() => setCargandoCanchas(false))
  }, [])

  // Cargar turnos cada vez que cambia cancha o fecha
  useEffect(() => {
    if (!canchaId) return
    setCargandoTurnos(true)
    setErrorTurnos(null)
    setTurnoId(null)
    turnosDisponibles(canchaId, fecha)
      .then(setTurnos)
      .catch((e) => setErrorTurnos(e.message))
      .finally(() => setCargandoTurnos(false))
  }, [canchaId, fecha])

  async function confirmar() {
    if (!turnoId) return
    setEnviando(true)
    setErrorEnvio(null)
    try {
      await crearReserva({ reserva: { cancha_id: canchaId, turno_id: turnoId } })
      setExito(true)
    } catch (e) {
      setErrorEnvio(e.message)
    } finally {
      setEnviando(false)
    }
  }

  function reiniciar() {
    setCanchaId(null)
    setTurnoId(null)
    setFecha(HOY)
    setTurnos([])
    setExito(false)
    setErrorEnvio(null)
  }

  if (exito) {
    return (
      <section>
        <h1>Reservar</h1>
        <div className="alerta alerta-exito" role="status">
          <p>✅ ¡Reserva confirmada!</p>
          <button type="button" className="boton" onClick={reiniciar}>
            Hacer otra reserva
          </button>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h1>Reservar</h1>

      {/* PASO 1: Elegir cancha */}
      <h2>1. Elegí una cancha</h2>
      {cargandoCanchas && <Cargando texto="Cargando canchas…" />}
      {errorCanchas && (
        <MensajeError mensaje={errorCanchas} onReintentar={() => window.location.reload()} />
      )}
      {!cargandoCanchas && !errorCanchas && (
        <div className="grilla-canchas">
          {canchas.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`tarjeta-cancha boton-secundario${canchaId === c.id ? ' seleccionada' : ''}`}
              onClick={() => setCanchaId(c.id)}
            >
              <strong>{c.nombre}</strong>
              {c.descripcion && <span>{c.descripcion}</span>}
            </button>
          ))}
        </div>
      )}

      {/* PASO 2: Elegir fecha y turno */}
      {canchaId && (
        <>
          <h2>2. Elegí fecha y turno</h2>
          <label htmlFor="fecha">Fecha</label>
          <input
            id="fecha"
            type="date"
            min={HOY}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          {cargandoTurnos && <Cargando texto="Cargando turnos…" />}
          {errorTurnos && <MensajeError mensaje={errorTurnos} />}
          {!cargandoTurnos && !errorTurnos && turnos.length === 0 && (
            <p>No hay turnos disponibles para esa fecha.</p>
          )}
          {!cargandoTurnos && turnos.length > 0 && (
            <div className="grilla-turnos">
              {turnos.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`boton boton-secundario${turnoId === t.id ? ' seleccionado' : ''}`}
                  onClick={() => setTurnoId(t.id)}
                >
                  {t.hora_inicio} – {t.hora_fin}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* PASO 3: Confirmar */}
      {turnoId && (
        <>
          <h2>3. Confirmá tu reserva</h2>
          {errorEnvio && <MensajeError mensaje={errorEnvio} />}
          <button
            type="button"
            className="boton"
            onClick={confirmar}
            disabled={enviando}
          >
            {enviando ? 'Confirmando…' : 'Confirmar reserva'}
          </button>
        </>
      )}
    </section>
  )
}