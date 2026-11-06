import { data } from "react-router-dom";
import { api } from "./client";

export const listarCanchas = () => api('/canchas').then((data) => {
    const BASE = import.meta.env.VITE_API_URL.replace('/api/v1','')
    return data.map((c) =>({
        ...c,
        foto_url: c.foto_url ? `${BASE}${c.foto_url}` : null,
    }))
})

export const obetenerCanchas = () => api(`/canchas/${id}`)

export const turnosDisponibles = (canchaId, fecha) => api(`/canchas/${canchaId}/turnos_disponibles?fecha=${fecha}`) 