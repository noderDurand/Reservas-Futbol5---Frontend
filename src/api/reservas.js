import { api } from './client'

export const listarReservas = () => api('/reservas')

export const obtenerReserva = (id) => api(`/reservas/${id}`)

export const crearReserva = (datos) =>
  api('/reservas', { method: 'POST', body: datos })

export const cancelarReserva = (id) =>
  api(`/reservas/${id}/cancelar`, { method: 'PATCH' })