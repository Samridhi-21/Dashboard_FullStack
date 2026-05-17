# Smart Leads Dashboard

A production-ready full-stack Lead Management Dashboard built with React, TypeScript, Node.js, Express, and MongoDB. Features JWT authentication, role-based access control, advanced filtering, pagination, debounced search, and CSV export.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, React Router, Axios, React Hook Form |
| Backend | Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt |
| DevOps | Docker, Docker Compose |

## Features

- **Authentication** — Register, login, JWT tokens, protected routes
- **RBAC** — Admin (full CRUD) vs Sales User (view + create only)
- **Leads CRUD** — Create, read, update, delete leads
- **Advanced Filtering** — Combined status, source, search, and sort filters
- **Pagination** — Server-side pagination (10 records/page)
- **Debounced Search** — 400ms debounce via `useEffect` + `setTimeout`
- **CSV Export** — Export filtered leads to CSV
- **Responsive UI** — Modern dashboard with loading, empty, and error states

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & database config
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routers
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Helpers, seed script
│   │   ├── validators/      # express-validator rules
│   │   └── index.ts         # App entry point
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # UI, layout, leads components
│   │   ├── context/         # Auth context (Context API)
│   │   ├── hooks/           # useDebounce
│   │   ├── pages/           # Login, Register, Dashboard, Lead Details
│   │   ├── services/        # API clients
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Helpers
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js 20+
- MongoDB 7+ (local or Docker)
- npm

## Local Setup

### 1. Clone and install dependencies

```bash
cd "FULL STACK project 1"

# Backend
cd backend
npm install
cp .env.example .env   # Edit values if needed

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. Start MongoDB

Ensure MongoDB is running on `mongodb://localhost:27017` or update `MONGODB_URI` in `backend/.env`.

```bash
# Using Docker
docker run -d -p 27017:27017 --name smart-leads-mongo mongo:7
```

### 3. Seed sample data (optional)

```bash
cd backend
npm run seed
```

**Demo accounts after seeding:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smartleads.com | admin123 |
| Sales | sales@smartleads.com | sales123 |

### 4. Run the application

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/smart-leads` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |
| `npm run seed` | Seed database with sample data |
| `npm run lint` | Type-check without emit |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Type-check |

## API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require header: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login and receive JWT |
| GET | `/auth/me` | Yes | Get current user |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "sales"
}
```

**Login body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "admin" },
    "token": "eyJhbG..."
  }
}
```

### Leads

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/leads` | Any | List leads (paginated, filtered) |
| GET | `/leads/export` | Any | Export leads as CSV |
| GET | `/leads/:id` | Any | Get single lead |
| POST | `/leads` | Any | Create lead |
| PUT | `/leads/:id` | Admin | Update lead |
| DELETE | `/leads/:id` | Admin | Delete lead |

**Query parameters (GET /leads, GET /leads/export):**

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | `Website`, `Instagram`, `Referral` |
| `search` | string | Search by name or email |
| `sort` | string | `latest` (default) or `oldest` |
| `page` | number | Page number (default: 1) |

**Example:** `GET /leads?status=Qualified&source=Instagram&search=rahul&sort=latest&page=1`

**Paginated response:**
```json
{
  "success": true,
  "message": "Leads retrieved successfully",
  "data": { "leads": [...] },
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalRecords": 12,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Create lead body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

## Docker Setup

Run the entire stack with Docker Compose:

```bash
# From project root
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| MongoDB | localhost:27017 |

Seed data after containers are up:

```bash
docker exec -it smart-leads-backend sh -c "npm run seed"
```



## Role Permissions

| Action | Admin | Sales User |
|--------|-------|------------|
| View leads | ✅ | ✅ |
| Create lead | ✅ | ✅ |
| Update lead | ✅ | ❌ |
| Delete lead | ✅ | ❌ |
| Export CSV | ✅ | ✅ |

## License

MIT
