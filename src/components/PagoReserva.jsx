import { useState, useEffect } from 'react'
import { obtenerReserva } from '../api/reservas'

const CADA_CUANTO_CONSULTAR_MS = 3000

function formatearTiempo(ms) {
  const totalSegundos = Math.max(0, Math.floor(ms / 1000))
  const minutos = String(Math.floor(totalSegundos / 60)).padStart(2, '0')
  const segundos = String(totalSegundos % 60).padStart(2, '0')
  return `${minutos}:${segundos}`
}

// Pantalla de pago de una reserva: muestra el QR, la cuenta regresiva y
// consulta al back hasta que el pago se apruebe (confirmada) o venza (cancelada).
// `reservaInicial` es la reserva que devuelve la API (con pago.qr_svg y vence_en).
export default function PagoReserva({ reservaInicial, onTerminar, textoTerminar }) {
  const [reserva, setReserva] = useState(reservaInicial)
  const [ahora, setAhora] = useState(() => Date.now())
  const [errorConsulta, setErrorConsulta] = useState(null)

  const pendiente = reserva.estado === 'pendiente'
  const msRestantes = reserva.vence_en ? new Date(reserva.vence_en).getTime() - ahora : 0
  // El back solo cancela de verdad cuando corre el job; antes de eso la reserva
  // puede seguir figurando "pendiente" aunque el plazo ya haya pasado.
  const vencida = pendiente && msRestantes <= 0
  const esperandoPago = pendiente && !vencida

  // Reloj para la cuenta regresiva
  useEffect(() => {
    if (!esperandoPago) return
    const id = setInterval(() => setAhora(Date.now()), 1000)
    return () => clearInterval(id)
  }, [esperandoPago])

  // Consulta periódica: detecta cuando el QR fue escaneado
  useEffect(() => {
    if (!esperandoPago) return
    const id = setInterval(() => {
      obtenerReserva(reserva.id)
        .then((r) => {
          setReserva(r)
          setErrorConsulta(null)
        })
        .catch((e) => setErrorConsulta(e.message))
    }, CADA_CUANTO_CONSULTAR_MS)
    return () => clearInterval(id)
  }, [esperandoPago, reserva.id])

  const detalle = `${reserva.cancha?.nombre} · ${reserva.fecha} · ${reserva.turno?.hora_inicio} a ${reserva.turno?.hora_fin}`

  if (reserva.estado === 'confirmada') {
    return (
      <div className="alerta alerta-exito" role="status">
        <p>✅ ¡Pago aprobado, reserva confirmada!</p>
        <p>{detalle}</p>
        <button type="button" className="boton" onClick={onTerminar}>{textoTerminar}</button>
      </div>
    )
  }

  if (reserva.estado === 'cancelada' || vencida) {
    return (
      <div className="alerta alerta-error" role="alert">
        <p>
          {vencida
            ? 'Se acabó el tiempo para pagar: la reserva se canceló y el turno quedó libre.'
            : 'Esta reserva está cancelada y el turno quedó libre.'}
        </p>
        <button type="button" className="boton" onClick={onTerminar}>{textoTerminar}</button>
      </div>
    )
  }

  return (
    <div className="pago-reserva">
      <h2>Pagá para confirmar tu reserva</h2>
      <p>{detalle}</p>
      {reserva.pago?.precio && <p><strong>Total: ${reserva.pago.precio}</strong></p>}

      {reserva.pago?.qr_svg ? (
        <div
          className="pago-qr"
          role="img"
          aria-label="Código QR para pagar la reserva"
          // SVG generado por nuestro propio back (rqrcode), no contenido de usuarios
          dangerouslySetInnerHTML={{ __html: reserva.pago.qr_svg }}
        />
      ) : (
        <p>No se pudo mostrar el QR. Volvé a Mis reservas e intentá de nuevo.</p>
      )}

      <p>Escaneá el código con tu celular para pagar.</p>
      <p className="pago-tiempo">
        Tiempo restante: <strong>{formatearTiempo(msRestantes)}</strong>
      </p>
      {errorConsulta && <p className="pago-aviso">No pudimos verificar el pago: {errorConsulta}</p>}

      <button type="button" className="boton boton-secundario" onClick={onTerminar}>
        Pagar más tarde
      </button>
    </div>
  )
}
