# Contrato de Interfaz de API (Frontend - Backend)

**Proyecto:** Sistema de Reservas de Fútbol 5  
**Backend:** Ruby on Rails (TP1) – Base path `/api/v1`  
**Frontend:** React + Vite (TP2)  
**Formato de intercambio:** JSON  
**Autenticación:** HTTP Bearer Token en cabecera `Authorization: Bearer <token>`

---

## 1. Convenciones Generales

- **Base URL:** `http://<servidor>:3000/api/v1`
- **Headers en peticiones:**
  ```http
  Content-Type: application/json
  Accept: application/json
  Authorization: Bearer <token>   # (en endpoints protegidos)
  ```
- **Formato de errores estándar (HTTP 4xx / 5xx):**
  ```json
  {
    "errors": ["Mensaje explicativo del error"]
  }
  ```

---

## 2. Autenticación y Perfil

### 2.1 Iniciar sesión
- **Método y Ruta:** `POST /login`
- **Público:** Sí
- **Request Body:**
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "secretPassword"
  }
  ```
- **Respuesta exitosa (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "usuario@ejemplo.com"
    }
  }
  ```
- **Errores:** `401 Unauthorized` si las credenciales son incorrectas.

---

### 2.2 Registrar nuevo usuario
- **Método y Ruta:** `POST /signup`
- **Público:** Sí
- **Request Body:**
  ```json
  {
    "user": {
      "name": "Juan Pérez",
      "email": "usuario@ejemplo.com",
      "password": "secretPassword",
      "password_confirmation": "secretPassword"
    }
  }
  ```
- **Respuesta exitosa (201 Created / 200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "usuario@ejemplo.com"
    }
  }
  ```
- **Errores:** `422 Unprocessable Entity` (ej: email en uso, contraseña corta).

---

### 2.3 Cerrar sesión
- **Método y Ruta:** `DELETE /logout`
- **Protegido:** Sí (Bearer Token)
- **Respuesta exitosa (200 OK / 204 No Content):** `{}`

---

### 2.4 Obtener perfil actual
- **Método y Ruta:** `GET /profile`
- **Protegido:** Sí (Bearer Token)
- **Respuesta exitosa (200 OK):**
  ```json
  {
    "id": 1,
    "name": "Juan Pérez",
    "email": "usuario@ejemplo.com"
  }
  ```
- **Errores:** `401 Unauthorized` si el token expiró o es inválido.

---

## 3. Canchas y Disponibilidad

### 3.1 Listar canchas
- **Método y Ruta:** `GET /canchas`
- **Protegido:** Sí
- **Respuesta exitosa (200 OK):**
  ```json
  [
    {
      "id": 1,
      "nombre": "Cancha 1 (Techada)",
      "descripcion": "Césped sintético de última generación con iluminación LED",
      "foto_url": "/rails/active_storage/blobs/..."
    }
  ]
  ```

---

### 3.2 Detalle de una cancha
- **Método y Ruta:** `GET /canchas/:id`
- **Protegido:** Sí
- **Respuesta exitosa (200 OK):**
  ```json
  {
    "id": 1,
    "nombre": "Cancha 1 (Techada)",
    "descripcion": "Césped sintético de última generación con iluminación LED",
    "foto_url": "/rails/active_storage/blobs/..."
  }
  ```

---

### 3.3 Turnos disponibles por cancha y fecha
- **Método y Ruta:** `GET /canchas/:id/turnos_disponibles?fecha=YYYY-MM-DD`
- **Protegido:** Sí
- **Query Params:**
  - `fecha`: Fecha seleccionada en formato `YYYY-MM-DD` (ej: `2026-11-10`).
- **Respuesta exitosa (200 OK):**
  ```json
  [
    {
      "id": 4,
      "hora_inicio": "18:00",
      "hora_fin": "19:00"
    },
    {
      "id": 5,
      "hora_inicio": "19:00",
      "hora_fin": "20:00"
    }
  ]
  ```

---

## 4. Reservas y Pagos

### 4.1 Listar reservas del usuario actual
- **Método y Ruta:** `GET /reservas`
- **Protegido:** Sí (retorna únicamente las reservas del usuario autenticado)
- **Respuesta exitosa (200 OK):**
  ```json
  [
    {
      "id": 12,
      "fecha": "2026-11-12",
      "estado": "pendiente",
      "cancha_id": 1,
      "cancha": {
        "id": 1,
        "nombre": "Cancha 1 (Techada)"
      },
      "turno": {
        "id": 4,
        "hora_inicio": "18:00",
        "hora_fin": "19:00"
      }
    }
  ]
  ```

---

### 4.2 Crear reserva
- **Método y Ruta:** `POST /reservas`
- **Protegido:** Sí
- **Request Body:**
  ```json
  {
    "reserva": {
      "cancha_id": 1,
      "turno_id": 4,
      "fecha": "2026-11-12"
    }
  }
  ```
- **Respuesta exitosa (201 Created / 200 OK):**
  ```json
  {
    "id": 12,
    "fecha": "2026-11-12",
    "estado": "pendiente",
    "vence_en": "2026-11-09T14:45:00Z",
    "cancha": {
      "id": 1,
      "nombre": "Cancha 1 (Techada)"
    },
    "turno": {
      "id": 4,
      "hora_inicio": "18:00",
      "hora_fin": "19:00"
    },
    "pago": {
      "precio": 15000,
      "qr_svg": "<svg xmlns='http://www.w3.org/2000/svg' ...></svg>"
    }
  }
  ```
- **Errores:** `422 Unprocessable Entity` (ej: turno ya ocupado).

---

### 4.3 Detalle de reserva (con datos de pago / QR)
- **Método y Ruta:** `GET /reservas/:id`
- **Protegido:** Sí
- **Respuesta exitosa (200 OK):**
  ```json
  {
    "id": 12,
    "fecha": "2026-11-12",
    "estado": "pendiente",
    "vence_en": "2026-11-09T14:45:00Z",
    "cancha": {
      "id": 1,
      "nombre": "Cancha 1 (Techada)"
    },
    "turno": {
      "id": 4,
      "hora_inicio": "18:00",
      "hora_fin": "19:00"
    },
    "pago": {
      "precio": 15000,
      "qr_svg": "<svg ...></svg>"
    }
  }
  ```

---

### 4.4 Cancelar reserva
- **Método y Ruta:** `PATCH /reservas/:id/cancelar`
- **Protegido:** Sí
- **Respuesta exitosa (200 OK):**
  ```json
  {
    "id": 12,
    "estado": "cancelada"
  }
  ```
- **Errores:** `422 Unprocessable Entity` si la reserva ya no puede ser cancelada.
