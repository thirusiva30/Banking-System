# SecureBank: Banking Portal (MERN)

## Features
- Register and login with bcrypt password hashing and JWT sessions
- Login rate limiting (5 attempts per 15 minutes)
- Automatic logout after 15 minutes of inactivity
- Multiple accounts (checking and savings) with masked account numbers
- Transaction history per account
- Internal money transfers inside a MongoDB transaction (debit and credit are atomic)

## Prerequisites
- Node.js 18 or later
- A MongoDB Atlas cluster (free tier works). Transfers need a replica set, which Atlas provides by default. Local MongoDB needs to be started as a replica set.

## Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm run dev               # runs on http://localhost:5000
```

Generate a JWT secret with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev               # runs on http://localhost:5173
```

Open http://localhost:5173, register, and start banking. Vite proxies `/api` calls to the backend.

## Project structure
```
backend/
  server.js               App entry, middleware and route mounting
  config/db.js            MongoDB connection
  models/                 User, Account, Transaction schemas
  routes/                 auth, accounts, transfers
  middleware/             JWT auth guard, error handler
  utils/                  money rounding, account number generator, HTTP errors
frontend/
  src/App.jsx             Routes and protected route wrapper
  src/context/            Auth state, session restore, inactivity timer
  src/pages/              Login, Register, Dashboard, Transfer
  src/components/         Shared layout with navigation
  src/api.js              Axios instance with token injection
```

## Notes for submission
- This is a working core. Features listed in the project report such as 2FA, bill pay, cards, and external transfers are natural next modules that follow the same route, model, and page pattern.
- Before deploying, change JWT_SECRET, restrict CLIENT_URL to your Vercel domain, and enable MongoDB IP access rules.
