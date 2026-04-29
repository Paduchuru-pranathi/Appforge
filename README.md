# AppForge 🚀

A config-driven app generator — turn JSON into fully working web apps.

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, TanStack Query
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Auth**: Email/Password + Google OAuth
- **Deploy**: Render

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Setup Environment Variables

**Backend** (`backend/.env`):
```
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/appforge
JWT_SECRET=any-long-random-string
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Create Database
```bash
createdb appforge
# Tables are auto-created on first run
```

### 4. Run

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

Open http://localhost:3000

---

## Deployment on Render

### Backend Service
- **Type**: Web Service
- **Build**: `npm install && npm run build`
- **Start**: `npm start`
- **Env vars**: All from .env.example

### Frontend Service
- **Type**: Static Site or Web Service
- **Build**: `npm install && npm run build`
- **Start**: `npm start`
- **Env var**: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

### Database
- Add a **PostgreSQL** service on Render
- Copy the `DATABASE_URL` to your backend env vars
