import { api, guardarToken, borrarToken } from './client'

export async function iniciarSesion(email, password) {
    const datos = await api('/login', { method: 'POST', body: { email, password } })
    guardarToken(datos.token)
    return datos.user
}

export async function registrarse({ name, email, password, password_confirmation }) {
    const datos = await api('/signup', {
        method: 'POST',
        body: { user: { name, email, password, password_confirmation } },
    })
    guardarToken(datos.token)
    return datos.user
}

export async function cerrarSesion() {
    // Aunque falle el DELETE, la sesión local se cierra igual
    await api('/logout', { method: 'DELETE' }).catch(() => {})
    borrarToken()
}

export const obtenerPerfil = () => api('/profile')
