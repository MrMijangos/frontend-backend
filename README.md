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

Todas las peticiones deben incluir `credentials: 'include'` para que las cookies se envíen automáticamente.

---

## Imágenes

Los endpoints que aceptan imágenes usan **`multipart/form-data`**. No uses `application/json` en esos endpoints.

Las imágenes se guardan en:
- `uploads/users/` → fotos de perfil
- `uploads/lobbys/` → imágenes de lobbys
- `uploads/posts/` → imágenes de publicaciones

Todas las imágenes son accesibles públicamente en:
```
http://localhost:3000/uploads/users/squadup_fernando_1234567890.png
http://localhost:3000/uploads/lobbys/squadup_milobby_1234567890.png
http://localhost:3000/uploads/posts/squadup_post_7_1234567890_abc12.png
```

Límites: **5MB por imagen**, formatos: `jpg`, `jpeg`, `png`, `webp`. Los posts aceptan hasta **10 imágenes**.

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
| GET | `/api/lobbys/my` | ✅ | — | Mis lobbys |
| GET | `/api/lobbys/:id` | ✅ | — | Obtener lobby por ID |
| PUT | `/api/lobbys/:id` | ✅ | form-data | Actualizar lobby (solo owner) |
| DELETE | `/api/lobbys/:id` | ✅ | — | Eliminar lobby (solo owner) |
| POST | `/api/lobbys/:id/join` | ✅ | — | Unirse a un lobby |
| POST | `/api/lobbys/:id/leave` | ✅ | — | Salir de un lobby |
| GET | `/api/lobbys/:id/members` | ✅ | — | Ver miembros del lobby |
| GET | `/api/lobbys/:id/messages?limit=50` | ✅ | — | Historial de mensajes (REST fallback) |

### Posts

| Método | Ruta | Auth | Body | Descripción |
|--------|------|------|------|-------------|
| POST | `/api/posts` | ✅ | json | Crear post |
| GET | `/api/posts` | ✅ | — | Todos los posts |
| GET | `/api/posts/:id` | ✅ | — | Post por ID |
| GET | `/api/posts/user/:id` | ✅ | — | Posts de un usuario |
| GET | `/api/posts/lobby/:id` | ✅ | — | Posts de un lobby |
| PUT | `/api/posts/:id` | ✅ | json | Editar post (solo autor) |
| DELETE | `/api/posts/:id` | ✅ | — | Eliminar post (solo autor) |
| POST | `/api/posts/:id/images` | ✅ | form-data | Subir imágenes al post (máx 10) |
| GET | `/api/posts/:id/images` | ✅ | — | Ver imágenes del post |
| DELETE | `/api/posts/:id/images/:imageId` | ✅ | — | Eliminar una imagen (solo autor) |

---

## WebSocket — Chat en tiempo real

Instala en el frontend:
```bash
npm install socket.io-client
```

### Conectarse

```javascript
import { io } from 'socket.io-client';

// Opción 1: cookies automáticas
const socket = io('http://localhost:3000', {
  withCredentials: true,
});

// Opción 2: token manual (si las cookies no llegan en el handshake)
const socket = io('http://localhost:3000', {
  auth: { token: 'tu_jwt_aqui' },
});
```

### Eventos que emites (cliente → servidor)

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `join_lobby` | `lobby_id: number` | Entrar al chat de un lobby |
| `leave_lobby` | `lobby_id: number` | Salir de la sala |
| `send_message` | `{ lobby_id: number, content: string }` | Enviar mensaje |

### Eventos que recibes (servidor → cliente)

| Evento | Datos | Descripción |
|--------|-------|-------------|
| `message_history` | `Message[]` | Historial al hacer `join_lobby` |
| `new_message` | `Message` | Mensaje nuevo en tiempo real |
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

### Login (json)

```javascript
const res = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

### Registro con foto (form-data)

```javascript
const formData = new FormData();
formData.append('name', 'Fernando');
formData.append('lastname', 'Toledo');
formData.append('email', 'fernando@mail.com');
formData.append('password', '123456');
formData.append('profile_picture', fileInput.files[0]); // opcional

const res = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  credentials: 'include',
  body: formData,
  // ⚠️ NO agregues Content-Type, el navegador lo setea automático
});
```

### Crear lobby con imagen (form-data)

```javascript
const formData = new FormData();
formData.append('name', 'Mi Lobby');
formData.append('description', 'Descripción opcional');
formData.append('image', fileInput.files[0]); // opcional

const res = await fetch('http://localhost:3000/api/lobbys', {
  method: 'POST',
  credentials: 'include',
  body: formData,
});
```

### Crear post (json)

```javascript
const res = await fetch('http://localhost:3000/api/posts', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    description: 'Mi publicación',
    lobby_id: 3, // opcional
  }),
});
const { post } = await res.json();
```

### Subir imágenes a un post (form-data, múltiples)

```javascript
const formData = new FormData();
// Agregar múltiples imágenes con el mismo campo "images"
formData.append('images', fileInput.files[0]);
formData.append('images', fileInput.files[1]);
formData.append('images', fileInput.files[2]);

const res = await fetch(`http://localhost:3000/api/posts/${postId}/images`, {
  method: 'POST',
  credentials: 'include',
  body: formData,
});
```

```html
<!-- Input que acepta múltiples archivos -->
<input type="file" id="postImages" accept="image/*" multiple />
```

```javascript
// Leer todos los archivos del input
const files = document.getElementById('postImages').files;
const formData = new FormData();
for (const file of files) {
  formData.append('images', file);
}
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

// json
const login = (email, password) => api.post('/auth/login', { email, password });
const createPost = (data) => api.post('/posts', data);

// form-data
const register = (formData) => api.post('/auth/register', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
const uploadPostImages = (postId, formData) => api.post(`/posts/${postId}/images`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
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
│   │       ├── uploadLobby.ts
│   │       └── uploadPost.ts
│   ├── users/
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   ├── lobbys/
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   ├── messages/
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   │       └── socket/chatSocket.ts
│   └── posts/
│       ├── domain/
│       ├── application/
│       └── infrastructure/
├── uploads/
│   ├── users/
│   ├── lobbys/
│   └── posts/
├── main.ts
├── schema.sql
└── .env
```

---

## Notas importantes

- Endpoints con imágenes usan `multipart/form-data`. **No envíes `Content-Type: application/json`** en esos, el navegador lo maneja solo.
- Posts: primero crea el post con json (`POST /api/posts`), luego sube las imágenes con form-data (`POST /api/posts/:id/images`).
- Solo el **autor** puede editar, eliminar un post o sus imágenes.
- Solo el **owner** puede editar o eliminar su lobby. El owner no puede usar `/leave`.
- Las cookies son `HttpOnly` — se envían automáticamente con `credentials: 'include'`.
- El WebSocket requiere autenticación. Si las cookies no llegan en el handshake, pasa el token en `auth: { token }`.