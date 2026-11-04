import { api } from "./client";

export const listarCanchas = () => api('/canchas')

export const obetenerCanchas = () => api(`/canchas/${id}`)

export const turnosDisponibles = (canchaId, fecha) => api(`/canchas/${canchaId}/turnos_disponibles?fecha=${fecha}`) 