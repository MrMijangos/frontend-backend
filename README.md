# SquadUp Backend API

API REST + WebSocket construida con Node.js, TypeScript, Express, Socket.io y MySQL siguiendo arquitectura hexagonal.

---

## Requisitos

- Node.js >= 16
- MySQL >= 8
- npm

---

## Instalación

```bash
git clone https://github.com/tu-usuario/squadup_backend.git
cd squadup_backend
npm install
```

---

## Variables de entorno

Copia `.env.example` a `.env` y llena tus datos:

```bash
cp .env.example .env
```

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_password
DB_NAME=squadup_backend
DB_PORT=3306

JWT_SECRET=tu_jwt_secret
JWT_REFRESH_SECRET=tu_refresh_secret

PORT=3000
FRONTEND_URL=http://localhost:5173
```

---

## Base de datos

Corre el schema en MySQL:

```bash
mysql -u root -p < schema.sql
```

---

## Levantar el servidor

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

El servidor corre en `http://localhost:3000`
El WebSocket corre en `ws://localhost:3000`

---

## Autenticación

La API usa **JWT en cookies HttpOnly**. Al hacer login se setean automáticamente dos cookies:

| Cookie | Descripción |
|--------|-------------|
| `access_token` | JWT de acceso (corta duración) |
| `refresh_token` | Token para renovar el acceso |

En el frontend, todas las peticiones deben incluir `credentials: 'include'` para que las cookies se envíen automáticamente.

---

## Imágenes

Los endpoints que aceptan imágenes usan **`multipart/form-data`**. No uses `application/json` en esos endpoints.

Las imágenes se guardan en:
- `uploads/users/` → fotos de perfil
- `uploads/lobbys/` → imágenes de lobbys

Formato del nombre: `squadup_nombreusuario_timestamp.ext`

Las imágenes son accesibles públicamente en:
```
http://localhost:3000/uploads/users/squadup_fernando_1234567890.png
http://localhost:3000/uploads/lobbys/squadup_milobby_1234567890.png
```

---

## Endpoints REST

### Auth & Usuarios

| Método | Ruta | Auth | Body | Descripción |
|--------|------|------|------|-------------|
| POST | `/api/auth/register` | ❌ | form-data | Registro con foto opcional |
| POST | `/api/auth/login` | ❌ | json | Login |
| POST | `/api/auth/logout` | ❌ | — | Logout |
| POST | `/api/auth/refresh` | ❌ | — | Renovar token |
| GET | `/api/auth/profile` | ✅ | — | Perfil del usuario autenticado |
| GET | `/api/auth/verify` | ✅ | — | Verificar si el token es válido |
| GET | `/api/users` | ✅ | — | Listar todos los usuarios |
| GET | `/api/users/:id` | ✅ | — | Obtener usuario por ID |
| PUT | `/api/users/:id` | ✅ | form-data | Actualizar usuario con foto opcional |
| DELETE | `/api/users/:id` | ✅ | — | Eliminar usuario |

### Lobbys

| Método | Ruta | Auth | Body | Descripción |
|--------|------|------|------|-------------|
| POST | `/api/lobbys` | ✅ | form-data | Crear lobby con imagen opcional |
| GET | `/api/lobbys` | ✅ | — | Listar todos los lobbys |
| GET | `/api/lobbys/my` | ✅ | — | Mis lobbys (del usuario autenticado) |
| GET | `/api/lobbys/:id` | ✅ | — | Obtener lobby por ID |
| PUT | `/api/lobbys/:id` | ✅ | form-data | Actualizar lobby (solo owner) |
| DELETE | `/api/lobbys/:id` | ✅ | — | Eliminar lobby (solo owner) |
| POST | `/api/lobbys/:id/join` | ✅ | — | Unirse a un lobby |
| POST | `/api/lobbys/:id/leave` | ✅ | — | Salir de un lobby |
| GET | `/api/lobbys/:id/members` | ✅ | — | Ver miembros del lobby |

### Chat (REST fallback)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/lobbys/:id/messages?limit=50` | ✅ | Historial de mensajes de un lobby |

---

## WebSocket — Chat en tiempo real

La conexión WebSocket usa **Socket.io**. La autenticación se hace enviando el JWT en el handshake.

### Conectarse

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  withCredentials: true, // envía la cookie access_token automáticamente
});
```

Si el frontend no puede enviar cookies en el handshake, pasa el token manualmente:

```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'tu_jwt_aqui',
  },
});
```

### Eventos que emites (cliente → servidor)

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `join_lobby` | `lobby_id: number` | Entrar a la sala del chat de un lobby |
| `leave_lobby` | `lobby_id: number` | Salir de la sala |
| `send_message` | `{ lobby_id: number, content: string }` | Enviar un mensaje |

### Eventos que recibes (servidor → cliente)

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `message_history` | `Message[]` | Historial de mensajes al hacer `join_lobby` |
| `new_message` | `Message` | Nuevo mensaje en tiempo real |
| `error` | `{ message: string }` | Error del servidor |

### Estructura de un mensaje

```json
{
  "id": 1,
  "lobby_id": 3,
  "user_id": 7,
  "content": "Hola a todos!",
  "sentAt": "2025-04-22T10:30:00.000Z"
}
```

---

## Ejemplos de uso en el frontend

### Configuración base

```javascript
const API = 'http://localhost:3000/api';
```

### Registro con imagen (form-data)

```javascript
async function register(data) {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('lastname', data.lastname);
  formData.append('email', data.email);
  formData.append('password', data.password);
  if (data.profilePicture) formData.append('profile_picture', data.profilePicture);

  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
    // ⚠️ NO pongas Content-Type, el navegador lo setea automático con el boundary
  });

  return res.json();
}
```

### Login (json)

```javascript
async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
}
```

### Crear lobby con imagen (form-data)

```javascript
async function createLobby(data) {
  const formData = new FormData();
  formData.append('name', data.name);
  if (data.description) formData.append('description', data.description);
  if (data.image) formData.append('image', data.image);

  const res = await fetch(`${API}/lobbys`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  return res.json();
}
```

### Chat con Socket.io — ejemplo completo

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  withCredentials: true,
});

// Entrar al chat de un lobby
socket.emit('join_lobby', lobbyId);

// Recibir historial al entrar
socket.on('message_history', (messages) => {
  renderMessages(messages);
});

// Recibir mensajes nuevos en tiempo real
socket.on('new_message', (message) => {
  appendMessage(message);
});

// Enviar mensaje
socket.emit('send_message', { lobby_id: lobbyId, content: 'Hola!' });

// Salir del chat
socket.emit('leave_lobby', lobbyId);

// Errores
socket.on('error', (err) => console.error(err.message));
```

### Chat con Socket.io — React

```jsx
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

function LobbyChat({ lobbyId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000', { withCredentials: true });
    socketRef.current.emit('join_lobby', lobbyId);

    socketRef.current.on('message_history', (history) => setMessages(history));
    socketRef.current.on('new_message', (msg) => setMessages(prev => [...prev, msg]));

    return () => {
      socketRef.current.emit('leave_lobby', lobbyId);
      socketRef.current.disconnect();
    };
  }, [lobbyId]);

  const handleSend = () => {
    if (!input.trim()) return;
    socketRef.current.emit('send_message', { lobby_id: lobbyId, content: input });
    setInput('');
  };

  return (
    <div>
      <div>
        {messages.map(msg => (
          <p key={msg.id}><strong>{msg.user_id}:</strong> {msg.content}</p>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
}
```

### Con axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

const login = (email, password) => api.post('/auth/login', { email, password });

const register = (formData) => api.post('/auth/register', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

const getMessages = (lobbyId, limit = 50) =>
  api.get(`/lobbys/${lobbyId}/messages?limit=${limit}`);
```

---

## Estructura del proyecto

```
squadup_backend/
├── src/
│   ├── core/
│   │   ├── config/conn.ts
│   │   ├── security/
│   │   │   ├── auth.ts
│   │   │   ├── hash.ts
│   │   │   ├── jwt_middleware.ts
│   │   │   └── utils.ts
│   │   └── upload/
│   │       ├── uploadUser.ts
│   │       └── uploadLobby.ts
│   ├── users/
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   ├── lobbys/
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   └── messages/
│       ├── domain/
│       ├── application/
│       └── infrastructure/
│           ├── adapters/
│           ├── controllers/
│           ├── routes/
│           └── socket/
│               └── chatSocket.ts
├── uploads/
│   ├── users/
│   └── lobbys/
├── main.ts
├── schema.sql
└── .env
```

---

## Notas importantes

- Los endpoints con imágenes usan `multipart/form-data`. **No envíes `Content-Type: application/json`** en esos endpoints, el navegador lo maneja solo.
- El tamaño máximo de imagen es **5MB**. Formatos: `jpg`, `jpeg`, `png`, `webp`.
- Solo el **owner** puede editar o eliminar su lobby.
- El **owner** no puede usar `/leave`, debe eliminar el lobby directamente.
- Las cookies son `HttpOnly` — solo se envían automáticamente con `credentials: 'include'`.
- El chat usa **Socket.io**. Instala en el frontend: `npm install socket.io-client`.
- Si las cookies no llegan en el handshake del socket, pasa el token en `auth: { token }`.