const API_URL = import.meta.env.VITE_API_URL
const CLAVE_TOKEN = 'token'

export const obtenerToken = () => localStorage.getItem(CLAVE_TOKEN)
export const guardarToken = (token) => localStorage.setItem(CLAVE_TOKEN, token)
export const borrarToken = () => localStorage.removeItem(CLAVE_TOKEN)

export async function api(ruta, { method = 'GET', body } = {}) {
  const token = obtenerToken()
  let respuesta

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    // fetch solo falla así cuando no hay conexión o el backend está apagado
    throw new Error('No se pudo conectar con el servidor. Intentá de nuevo en unos segundos.')
  }

  const datos = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    // Token vencido o inválido: avisamos a la app para que cierre la sesión
    if (respuesta.status === 401 && token) {
      borrarToken()
      window.dispatchEvent(new Event('sesion-expirada'))
    }
    const error = new Error(datos?.errors?.join('. ') || 'Ocurrió un error inesperado.')
    error.status = respuesta.status
    throw error
  }

  return datos
}
