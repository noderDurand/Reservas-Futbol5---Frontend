import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { obtenerToken } from '../api/client'
import * as authApi from '../api/auth'

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    // Si hay token guardado, arrancamos "cargando" hasta confirmar quién es
    const [cargando, setCargando] = useState(() => Boolean(obtenerToken()))

    // Al recargar la página: recuperar el usuario a partir del token
    useEffect(() => {
        if (!obtenerToken()) return
        authApi
        .obtenerPerfil()
        .then((datos) => setUsuario(datos.user ?? datos))
        .catch(() => setUsuario(null))
        .finally(() => setCargando(false))
    }, [])

    // Si client.js detecta un 401, cerramos la sesión
    useEffect(() => {
        const alExpirar = () => setUsuario(null)
        window.addEventListener('sesion-expirada', alExpirar)
        return () => window.removeEventListener('sesion-expirada', alExpirar)
    }, [])

    async function login(email, password) {
        setUsuario(await authApi.iniciarSesion(email, password))
    }

    async function registro(datos) {
        setUsuario(await authApi.registrarse(datos))
    }

    async function logout() {
        await authApi.cerrarSesion()
        setUsuario(null)
    }

    return (
        <AuthContext.Provider value={{ usuario, cargando, login, registro, logout }}>
        {children}
        </AuthContext.Provider>
    )
}
