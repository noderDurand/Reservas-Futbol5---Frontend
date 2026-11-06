import { useState, useEffect } from 'react'
import { listarReservas, cancelarReserva, obtenerReserva } from '../api/reservas'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'
import PagoReserva from '../components/PagoReserva'

export default function MisReservas() {
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [cancelando, setCancelando] = useState(null) // id en proceso
  const [pagando, setPagando] = useState(null) // reserva cuyo QR se está mostrando
  const [abriendoPago, setAbriendoPago] = useState(null) // id en proceso

  function cargar() {
    setCargando(true)
    setError(null)
    listarReservas()
      .then(setReservas)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }

  useEffect(() => { cargar() }, [])

  async function handleCancelar(id) {
    if (!confirm('¿Seguro que querés cancelar esta reserva?')) return
    setCancelando(id)
    try {
      await cancelarReserva(id)
      // Actualizar en local sin re-fetch: marcar como cancelada
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado: 'cancelada' } : r))
      )
    } catch (e) {
      alert(e.message)
    } finally {
      setCancelando(null)
    }
  }

  // Abre la pantalla de pago: pide la reserva completa porque el listado no trae el QR
  async function handlePagar(id) {
    setAbriendoPago(id)
    try {
      setPagando(await obtenerReserva(id))
    } catch (e) {
      alert(e.message)
    } finally {
      setAbriendoPago(null)
    }
  }

  function cerrarPago() {
    setPagando(null)
    cargar() // el estado pudo cambiar (confirmada / cancelada)
  }

  if (pagando) {
    return (
      <section>
        <h1>Mis reservas</h1>
        <PagoReserva
          reservaInicial={pagando}
          onTerminar={cerrarPago}
          textoTerminar="Volver a mis reservas"
        />
      </section>
    )
  }

  if (cargando) return <Cargando texto="Cargando tus reservas…" />
  if (error) return <MensajeError mensaje={error} onReintentar={cargar} />

  if (reservas.length === 0) {
    return (
      <section>
        <h1>Mis reservas</h1>
        <p>Todavía no tenés reservas.</p>
      </section>
    )
  }

  return (
    <section>
      <h1>Mis reservas</h1>
      <ul className="lista-reservas">
        {reservas.map((r) => (
          <li key={r.id} className="tarjeta-reserva">
            <div className="reserva-info">
              <strong>{r.cancha?.nombre ?? `Cancha #${r.cancha_id}`}</strong>
              <span>{r.fecha} — {r.turno?.hora_inicio} a {r.turno?.hora_fin}</span>
              <span className={`estado estado-${r.estado}`}>{r.estado}</span>
            </div>
            {r.estado !== 'cancelada' && (
              <div className="reserva-acciones">
                {r.estado === 'pendiente' && (
                  <button
                    type="button"
                    className="boton"
                    onClick={() => handlePagar(r.id)}
                    disabled={abriendoPago === r.id}
                  >
                    {abriendoPago === r.id ? 'Abriendo…' : 'Pagar'}
                  </button>
                )}
                <button
                  type="button"
                  className="boton boton-secundario"
                  onClick={() => handleCancelar(r.id)}
                  disabled={cancelando === r.id}
                >
                  {cancelando === r.id ? 'Cancelando…' : 'Cancelar'}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}