# Cleaning Reports — Complete Setup Guide

A full-stack MERN application for building cleaning management, inspections, task assignment, client claims, and reporting.

## Architecture

- **Backend:** Node.js + Express + MongoDB + Mongoose
- **Frontend:** Vite + React + React Router + Axios
- **Database:** MongoDB (local or Atlas)
- **Auth:** JWT + bcrypt
- **File Storage:** Local `/uploads` folder (can integrate S3 later)

## Prerequisites

- Node.js 14+ and npm
- MongoDB running locally (or MongoDB Atlas URI)

## Project Structure

```
cleaning-reports/
├── backend/              # Express API server
│   ├── src/
│   │   ├── app.js        # Express app setup
│   │   ├── server.js     # Server entry
│   │   ├── config/       # DB, multer config
│   │   ├── middleware/   # Auth middleware
│   │   ├── models/       # Mongoose schemas
│   │   ├── controllers/  # Route handlers
│   │   └── routes/       # API routes
│   ├── test/             # Jest tests
│   ├── package.json
│   ├── .env.example
│   └── uploads/          # File storage
├── frontend/             # Vite + React app
│   ├── src/
│   │   ├── App.jsx       # Main component
│   │   ├── api.js        # API client
│   │   ├── AuthContext.jsx
│   │   ├── pages/        # Page components
│   │   └── main.jsx      # React entry
│   ├── package.json
│   ├── .env.example
│   ├── vite.config.js
│   └── index.html
└── design/               # Architecture docs
```

## Setup & Run

### 1. Backend Setup

```bash
cd cleaning-reports/backend

# Copy env example
cp .env.example .env

# Edit .env and set MongoDB URI if needed
# MONGO_URI=mongodb://localhost:27017/cleaning_reports_dev
# JWT_SECRET=your-secret-key

# Install dependencies
npm install

# Run tests (optional)
npm test

# Start server
npm start
# or dev with auto-reload:
npm run dev
```

Backend runs on `http://localhost:4000` by default.

### 2. Frontend Setup

```bash
cd cleaning-reports/frontend

# Copy env example
cp .env.example .env

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:3000` by default.

The Vite dev server proxies `/api/*` requests to the backend (see `vite.config.js`).

### 3. Access the Application

1. Open http://localhost:3000 in your browser
2. You will be redirected to the login page
3. Register a new account or login

### 4. Test Users (for development)

Register via the UI, or create users via API:

```bash
# Register admin
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'

# Register inspector
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Inspector John",
    "email": "inspector@example.com",
    "password": "password123",
    "role": "inspector"
  }'

# Register cleaner
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cleaner Mary",
    "email": "cleaner@example.com",
    "password": "password123",
    "role": "cleaner"
  }'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user

### Users
- `GET /api/users/me` — Get current user profile
- `GET /api/users` — List users (admin only)

### Buildings
- `GET /api/buildings` — List buildings
- `POST /api/buildings` — Create building
- `POST /api/buildings/:id/photo` — Upload building photo

### Inspections
- `POST /api/inspections` — Create inspection
- `GET /api/inspections` — List inspections
- `GET /api/inspections/:id` — Get inspection details
- `PUT /api/inspections/:id/finalize` — Finalize inspection
- `POST /api/inspections/:id/photo` — Upload inspection photo

### Tasks
- `POST /api/tasks` — Create task
- `GET /api/tasks` — List tasks
- `GET /api/tasks/:id` — Get task details
- `PUT /api/tasks/:id` — Update task
- `POST /api/tasks/:id/complete` — Mark task as complete

### Claims
- `POST /api/claims` — Create client claim
- `GET /api/claims` — List claims (supervisor/admin)
- `PUT /api/claims/:id/convert-task` — Convert claim to task

### Reports
- `POST /api/reports/generate` — Generate report
- `GET /api/reports` — List reports
- `GET /api/reports/:id` — Get report details

## Database Models

- **User:** name, email, passwordHash, role, phone, disabled, timestamps
- **Building:** name, address, photos[], areas[] (with subareas), createdBy, timestamps
- **Inspection:** buildingId, areaId, subareaId, inspectorId, items[], photos[], status, overallResult, reportPdfUrl, timestamps
- **Task:** source, sourceId, buildingId, areaId, assignedTo, assignedBy, status, priority, dueAt, timeAssigned, timeCompleted, photos[], notes, timestamps
- **Claim:** clientName, clientContact, buildingId, description, photos[], status, assignedTaskId, timestamps
- **Report:** type, generatedBy, filters, dataSummary, pdfUrl, timestamps
- **Upload:** filename, url, uploaderId, relatedType, relatedId, timestamps

## Features

✓ **User Management:** Register, login, role-based access (admin, supervisor, inspector, cleaner, client)
✓ **Buildings:** Register buildings, manage areas and subareas, upload photos
✓ **Inspections:** Create inspection reports, evaluate areas, finalize reports
✓ **Tasks:** Create cleaning tasks, assign to cleaners, track status (pending, in progress, resolved)
✓ **Claims:** Submit client complaints, convert to tasks, track resolution
✓ **Reports:** Generate daily/custom reports with PDF export
✓ **Supervision:** Approve/reject work, reassign tasks, monitor timelines
✓ **File Uploads:** Photos for buildings, inspections, and evidence
✓ **PDF Generation:** Auto-generate PDF reports with summary data

## Testing

Run backend tests:

```bash
cd cleaning-reports/backend
npm test
```

Tests use `mongodb-memory-server` for isolated MongoDB testing.

## Troubleshooting

**MongoDB connection error:**
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in backend `.env`

**Frontend API errors:**
- Check backend is running on port 4000
- Check `VITE_API_BASE` in frontend `.env`
- Check browser console for CORS issues

**Port already in use:**
- Backend: change `PORT` in `.env` and update frontend proxy
- Frontend: change `port` in `vite.config.js`

## Future Enhancements

- [ ] Real-time notifications (WebSockets)
- [ ] Advanced reporting & analytics dashboard
- [ ] S3/Cloud file storage
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Performance metrics & charts
- [ ] Audit logs
- [ ] Multi-language support

## License

MIT
