# API Specification — Cleaning Reports (MERN)

Autenticación

- POST /api/auth/register
  - body: { name, email, password, role }
  - response: { user, token }

- POST /api/auth/login
  - body: { email, password }
  - response: { user, token }

Users

- GET /api/users
- POST /api/users
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id

Buildings

- GET /api/buildings
- POST /api/buildings
- GET /api/buildings/:id
- PUT /api/buildings/:id
- POST /api/buildings/:id/photo (multipart)
- POST /api/buildings/:id/areas

Inspections

- POST /api/inspections
  - create inspection/report draft: { buildingId, areaId, subareaId, inspectorId, items[], photos[] }
- GET /api/inspections
- GET /api/inspections/:id
- PUT /api/inspections/:id/finalize
- POST /api/inspections/:id/photo

Tasks

- POST /api/tasks
- GET /api/tasks
- GET /api/tasks/:id
- PUT /api/tasks/:id (assign/update/status)
- POST /api/tasks/:id/complete

Claims

- POST /api/claims
- GET /api/claims
- PUT /api/claims/:id/convert-task

Reports

- POST /api/reports/generate
- GET /api/reports
- GET /api/reports/:id

Uploads

- POST /api/uploads (multipart)
- GET /uploads/:filename (static serve)

Seguridad

- Autenticación: JWT en `Authorization: Bearer <token>`
- Passwords: bcrypt
- RBAC: middleware que valida `req.user.role` para rutas protegidas

Modelos y payloads se definen en `../backend/src/models/`.
