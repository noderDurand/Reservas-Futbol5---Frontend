# Fútbol 5 — Sistema de Reservas (Frontend)

Frontend para la reserva de canchas de fútbol 5 orientado al cliente final, desarrollado con **React** y **Vite**. Consume la API RESTful provista por el backend en **Ruby on Rails** (TP1) bajo la ruta `/api/v1`.

---

## 📌 Alcance del Proyecto

La aplicación cubre el ciclo completo de interacción del cliente:

1. **Autenticación y Seguridad:**
   - Registro de usuarios con validaciones de formulario.
   - Inicio y cierre de sesión con tokens JWT (Bearer Token almacenado en `localStorage`).
   - Persistencia de sesión al recargar la página (`/api/v1/profile`).
   - Cierre automático de sesión ante tokens expirados o inválidos (error HTTP 401).
   - Rutas protegidas mediante componentes de orden superior (`RutaProtegida`).

2. **Exploración de Canchas:**
   - Catálogo de canchas con detalles y soporte para imágenes subidas desde el back-office (Active Storage).

3. **Selector Interactivo de Fechas y Turnos:**
   - Selección de fecha en formato de tarjetas deslizables horizontales para los próximos 10 días (con cálculo de zona horaria local).
   - Consulta dinámica de turnos libres para la cancha y fecha elegidas (`/turnos_disponibles`).

4. **Confirmación y Pago con QR:**
   - Creación de reservas en estado `pendiente`.
   - Visualización del código QR (SVG) provisto por el backend.
   - Cuenta regresiva del tiempo límite de pago.
   - Sondeo periódico (polling) para detectar automáticamente cuando el pago es aprobado o vence.

5. **Gestión de Reservas ("Mis Reservas"):**
   - Listado de turnos reservados por el usuario logueado con estados visuales (`pendiente`, `confirmada`, `cancelada`).
   - Opción de reabrir el pago de reservas pendientes.
   - Cancelación de reservas con liberación inmediata del turno.

---

## 🛠️ Tecnologías Utilizadas

- **React 19**
- **Vite 8** (Empaquetador y entorno de desarrollo ultra-rápido)
- **React Router 7** (Enrutamiento declarativo SPA y rutas anidadas)
- **ESLint 9** (Control de calidad y reglas estrictas de React Hooks)
- **CSS Nativo Moderno** (Diseño adaptable / responsive, variables CSS, accesibilidad con foco visible)

---

## 🚀 Puesta en Marcha

### 1. Requisitos Previos
- Node.js (versión 18 o superior)
- Backend en Ruby on Rails corriendo en local o accesible por red

### 2. Instalación de dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Copiá el archivo de ejemplo para crear tu `.env` local:
```bash
cp .env.example .env
```
Contenido de `.env`:
```env
VITE_API_URL=http://localhost:3000/api/v1
```
> **Nota:** Si vas a probar desde el celular en la misma red Wi-Fi, reemplazá `localhost` por tu IP local (ej: `http://192.168.1.50:3000/api/v1`) y levantá Rails con `rails s -b 0.0.0.0`.

### 4. Ejecución en modo desarrollo
```bash
npm run dev
```
La aplicación quedará disponible en `http://localhost:5173/` (o en la IP de red informada en consola).

---

## 🧪 Pruebas y Controles de Calidad

Para asegurar la calidad del código, estándares de React y ausencia de errores sintácticos o de integración:

### Control de Linter (ESLint)
Ejecuta las validaciones de sintaxis y reglas de React Hooks:
```bash
npm run lint
```
*Resultado esperado: 0 errores y 0 advertencias.*

### Compilación para Producción (Build)
Valida que todos los módulos compilen e integren correctamente:
```bash
npm run build
```
Los archivos de distribución optimizados se generarán en la carpeta `dist/`.

---

## 📂 Estructura del Código

```text
src/
├── api/             # Capa de comunicación con la API Rails (fetch wrapper)
│   ├── client.js    # Manejo de headers, token Bearer y eventos de sesión
│   ├── auth.js      # Servicios de login, signup, logout y perfil
│   ├── canchas.js   # Listado y detalle de canchas, consulta de turnos
│   └── reservas.js  # Creación, consulta y cancelación de reservas
├── assets/          # Imágenes e isotipos estáticos
├── components/      # Componentes reutilizables de UI y lógica
│   ├── Cargando.jsx
│   ├── MensajeError.jsx
│   ├── PagoReserva.jsx   # Pantalla de pago con QR, polling y temporizador
│   └── RutaProtegida.jsx # Guardián de rutas privadas
├── context/         # Estado global de autenticación (AuthProvider, useAuth)
├── layouts/         # Layout principal con Sidebar responsiva
├── pages/           # Vistas de la aplicación
│   ├── Inicio.jsx
│   ├── Login.jsx
│   ├── Registro.jsx
│   ├── Reservar.jsx     # Flujo paso a paso para reservar
│   ├── MisReservas.jsx  # Historial y gestión de reservas
│   └── NoEncontrada.jsx # Manejo de rutas inexistentes (404)
├── App.jsx          # Definición de rutas
├── main.jsx         # Punto de entrada de la aplicación
└── index.css        # Estilos globales y temas
```

---

## 📄 Contrato de la API

La especificación completa de los endpoints consumidos, formatos de payloads, respuestas esperadas y códigos de error se encuentra documentada en detalle en:

👉 **[CONTRATO.md](./CONTRATO.md)**
