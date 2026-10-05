# TaskFlow — Backend

API REST para **TaskFlow**: autenticación JWT, usuarios y CRUD de tareas por propietario. Pensada como pieza de portfolio freelance (Node.js / Express / Prisma / PostgreSQL).

Repositorio frontend: [taskflow-frontend](https://github.com/Ebertlimache/taskflow-frontend)

---

## Descripción

- Registro y login con contraseñas hasheadas (bcrypt)
- JWT Bearer para proteger rutas de tareas
- Cada usuario solo ve y modifica **sus** tareas (`userId` del token)
- Validación de inputs con Zod
- Errores centralizados (`AppError` + middleware)
- Health check para deploy/monitoreo

---

## Stack

- Node.js + Express 5
- Prisma 5 + PostgreSQL
- JWT (`jsonwebtoken`)
- bcrypt
- Zod 4
- dotenv / cors

---

## Arquitectura

```
src/
  app.js                 # Express app + rutas + error handler
  routes/                # authRoutes, taskRoutes
  controllers/           # validación Zod + respuesta HTTP
  services/              # lógica de negocio + Prisma
  middlewares/           # authMiddleware, errorHandler
  utils/                 # AppError, asyncHandler, validation
  prisma/                # client + seed
prisma/
  schema.prisma
  migrations/
```

Flujo típico: `Route → Controller (Zod) → Service (Prisma) → JSON`, con errores vía `next(err)` → `errorHandler`.

---

## Variables de entorno

Copia `.env.example` a `.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=change_me_to_a_long_random_string
PORT=3000
```

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | Sí | Connection string PostgreSQL |
| `JWT_SECRET` | Sí | Secreto para firmar/verificar JWT |
| `PORT` | No | Puerto HTTP (default `3000`; Railway inyecta `PORT`) |
| `SEED_EMAIL` / `SEED_NAME` / `SEED_PASSWORD` | No | Overrides del seed de demo |

---

## Instalación y ejecución local

Requisitos: Node.js 18+, PostgreSQL accesible.

```bash
npm install
cp .env.example .env
# Completa DATABASE_URL y JWT_SECRET

npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed    # opcional: usuario demo + tareas de ejemplo

npm run dev            # nodemon
# o
npm start              # producción local
```

Health check:

```bash
curl http://localhost:3000/health
# { "ok": true }
```

### Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo con nodemon |
| `npm start` | Arranque producción (`prisma migrate deploy` + server) |
| `npm run prisma:generate` | Genera Prisma Client |
| `npm run prisma:migrate` | Migraciones en desarrollo |
| `npm run prisma:migrate:deploy` | Migraciones en producción |
| `npm run prisma:seed` | Datos demo |

Usuario seed por defecto (si no defines overrides):

- Email: `demo@taskflow.dev`
- Password: `password1234`

---

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/health` | No | Health check |
| `POST` | `/auth/register` | No | Registro → `{ token, user }` |
| `POST` | `/auth/login` | No | Login → `{ token, user }` |
| `GET` | `/tasks` | Bearer | Lista tareas del usuario |
| `POST` | `/tasks` | Bearer | Crea tarea `{ title }` |
| `PUT` | `/tasks/:id` | Bearer | Actualiza `{ title?`, `completed? }` |
| `DELETE` | `/tasks/:id` | Bearer | Elimina tarea |

### Autenticación

Header:

```http
Authorization: Bearer <jwt>
```

El payload del JWT incluye `userId`. Las operaciones de tasks filtran siempre por ese id (no se puede editar/borrar tareas de otro usuario → `404`).

### Errores HTTP habituales

| Código | Cuándo |
|--------|--------|
| `400` | Validación Zod fallida |
| `401` | Credenciales inválidas o token ausente/inválido |
| `404` | Task no encontrada (o no pertenece al usuario) |
| `409` | Email ya registrado |
| `500` | Error interno (p. ej. `JWT_SECRET` no configurado al firmar) |

Cuerpo de error típico: `{ "message": "..." }`

---

## Deploy (Railway)

El hostname previo `taskflow-backend-production-ab92.up.railway.app` responde **`404 Application not found`**: el servicio ya no existe o no está vinculado en Railway. **No es un bug de rutas Express** (ni siquiera llega a la app).

Para volver a publicar:

1. Crear un proyecto en Railway con PostgreSQL.
2. Conectar este repositorio (root = backend).
3. Definir variables: `DATABASE_URL`, `JWT_SECRET`, `PORT` (automático).
4. Deploy: `npm start` ejecuta `prisma migrate deploy` y luego el servidor.
5. Probar `GET /health`.
6. Actualizar `VITE_API_BASE_URL` en el frontend con la nueva URL pública.

Archivo de apoyo: `railway.json` (build/start).

---

## Notas para revisores / clientes

Esta API demuestra auth JWT, ownership por usuario, validación, Prisma/SQL y error handling — el tipo de backend que suele requerir mantenimiento, debugging e integración frontend↔API en trabajos freelance.
