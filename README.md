# SquadUp Backend API

API REST construida con Node.js, TypeScript, Express y MySQL siguiendo arquitectura hexagonal.

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

## Endpoints

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

---

## Ejemplos de uso en el frontend

### Configuración base con fetch

```javascript
const API = 'http://localhost:3000/api';

// Siempre incluir credentials para que las cookies funcionen
const options = {
  credentials: 'include',
};
```

---

### Registro con imagen (form-data)

```javascript
async function register(data) {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('lastname', data.lastname);
  formData.append('email', data.email);
  formData.append('password', data.password);

  // Solo si el usuario seleccionó una imagen
  if (data.profilePicture) {
    formData.append('profile_picture', data.profilePicture); // File object
  }

  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
    // ⚠️ NO pongas Content-Type, el navegador lo setea automático con el boundary
  });

  return res.json();
}
```

```html
<!-- Ejemplo de input en HTML -->
<input type="file" id="avatar" accept="image/png, image/jpeg, image/webp" />
```

```javascript
// Obtener el File del input
const file = document.getElementById('avatar').files[0];
```

---

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
  // Las cookies se setean automáticamente en el navegador
}
```

---

### Obtener perfil

```javascript
async function getProfile() {
  const res = await fetch(`${API}/auth/profile`, {
    credentials: 'include', // envía la cookie access_token
  });

  return res.json();
}
```

---

### Logout

```javascript
async function logout() {
  await fetch(`${API}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
```

---

### Crear lobby con imagen (form-data)

```javascript
async function createLobby(data) {
  const formData = new FormData();
  formData.append('name', data.name);

  if (data.description) {
    formData.append('description', data.description);
  }

  if (data.image) {
    formData.append('image', data.image); // File object
  }

  const res = await fetch(`${API}/lobbys`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  return res.json();
}
```

---

### Unirse a un lobby

```javascript
async function joinLobby(lobbyId) {
  const res = await fetch(`${API}/lobbys/${lobbyId}/join`, {
    method: 'POST',
    credentials: 'include',
  });

  return res.json();
}
```

---

### Actualizar usuario con nueva foto (form-data)

```javascript
async function updateUser(userId, data) {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('lastname', data.lastname);
  formData.append('email', data.email);

  if (data.profilePicture) {
    formData.append('profile_picture', data.profilePicture);
  }

  const res = await fetch(`${API}/users/${userId}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });

  return res.json();
}
```

---

### Ejemplo con axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // equivalente a credentials: 'include'
});

// Login
const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

// Registro con imagen
const register = async (formData) => {
  const { data } = await api.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Crear lobby
const createLobby = async (formData) => {
  const { data } = await api.post('/lobbys', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
```

---

### Ejemplo con React + fetch

```jsx
function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('lastname', 'Apellido');
    formData.append('email', email);
    formData.append('password', password);
    if (avatar) formData.append('profile_picture', avatar);

    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <input type="file" accept="image/*" onChange={e => setAvatar(e.target.files[0])} />
      <button type="submit">Registrarse</button>
    </form>
  );
}
```

---

## Estructura del proyecto

```
squadup_backend/
├── src/
│   ├── core/
│   │   ├── config/
│   │   │   └── conn.ts               # Conexión MySQL
│   │   ├── security/
│   │   │   ├── auth.ts               # JWT helpers
│   │   │   ├── hash.ts               # bcrypt helpers
│   │   │   ├── jwt_middleware.ts     # Middleware de autenticación
│   │   │   └── utils.ts
│   │   └── upload/
│   │       ├── uploadUser.ts         # Multer config usuarios
│   │       └── uploadLobby.ts        # Multer config lobbys
│   ├── users/
│   │   ├── domain/                   # Entidades, interfaces, DTOs
│   │   ├── application/              # Casos de uso
│   │   └── infrastructure/           # Controladores, adaptadores, rutas
│   └── lobbys/
│       ├── domain/
│       ├── application/
│       └── infrastructure/
├── uploads/
│   ├── users/                        # Fotos de perfil
│   └── lobbys/                       # Imágenes de lobbys
├── main.ts
├── schema.sql
└── .env
```

---

## Notas importantes

- Los endpoints con imágenes usan `multipart/form-data`. **No envíes `Content-Type: application/json`** en esos endpoints, el navegador lo maneja solo.
- El tamaño máximo de imagen es **5MB**.
- Formatos aceptados: `jpg`, `jpeg`, `png`, `webp`.
- Solo el **owner** puede editar o eliminar su lobby.
- El **owner** no puede salir de su lobby con `/leave`, debe eliminarlo.
- Las cookies son `HttpOnly` — no son accesibles desde JavaScript, solo se envían automáticamente con `credentials: 'include'`.