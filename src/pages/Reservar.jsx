import { useState, useEffect } from 'react'
import { listarCanchas, turnosDisponibles } from '../api/canchas'
import { crearReserva } from '../api/reservas'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'
import PagoReserva from '../components/PagoReserva'

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function toISO(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dia}`
}

function generarProximasFechas(cantidad = 11) {
  return Array.from({ length: cantidad }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })
}

function etiquetaDia(d, i) {
  if (i === 0) return 'Hoy'
  if (i === 1) return 'Mañana'
  return DIAS[d.getDay()]
}

export default function Reservar() {
  
  const [canchas, setCanchas] = useState([])
  const [cargandoCanchas, setCargandoCanchas] = useState(true)
  const [errorCanchas, setErrorCanchas] = useState(null)
  const [canchaId, setCanchaId] = useState(null)

  // --- paso 2: elegir fecha y turno ---
  const [fecha, setFecha] = useState(toISO(new Date()))
  const [turnos, setTurnos] = useState([])
  const [cargandoTurnos, setCargandoTurnos] = useState(false)
  const [errorTurnos, setErrorTurnos] = useState(null)
  const [turnoId, setTurnoId] = useState(null)

  // --- paso 3: confirmar ---
  const [enviando, setEnviando] = useState(false)
  const [reservaCreada, setReservaCreada] = useState(null)
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
      const nueva = await crearReserva({ reserva: { cancha_id: canchaId, turno_id: turnoId, fecha }})
      setReservaCreada(nueva)
    } catch (e) {
      setErrorEnvio(e.message)
    } finally {
      setEnviando(false)
    }
  }

  function reiniciar() {
    setCanchaId(null)
    setTurnoId(null)
    setFecha(toISO(new Date()))
    setTurnos([])
    setReservaCreada(null)
    setErrorEnvio(null)
  }

  // La reserva queda pendiente hasta que se paga (QR): mostramos el pago
  if (reservaCreada) {
    return (
      <section>
        <h1>Reservar</h1>
        <PagoReserva
          reservaInicial={reservaCreada}
          onTerminar={reiniciar}
          textoTerminar="Hacer otra reserva"
        />
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
              {c.foto_url && (
                <img src={c.foto_url} alt={c.nombre} className='cancha-img'/>
              )}
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
          <div className="grilla-fechas">
            {generarProximasFechas().map((d, i) => {
              const iso = toISO(d)
              return (
                <button
                  key={iso}
                  type="button"
                  className={`tarjeta-fecha${fecha === iso ? ' seleccionada' : ''}`}
                  onClick={() => setFecha(iso)}
                >
                  <span className="fecha-dia-nombre">{etiquetaDia(d, i)}</span>
                  <span className="fecha-numero">{d.getDate()}</span>
                  <span className="fecha-mes">{MESES[d.getMonth()]}</span>
                </button>
              )
            })}
          </div>
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
            {enviando ? 'Reservando…' : 'Reservar y pagar'}
          </button>
        </>
      )}
    </section>
  )
}