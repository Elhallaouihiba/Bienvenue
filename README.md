# Marhba — Complete Authentication Application

Marhba is a full-stack authentication starter kit with a Node.js/Express + PostgreSQL backend and an Expo/React Native mobile app. It implements a complete, production-style JWT auth flow: register, login, silent access-token refresh, logout, and a protected "current user" endpoint.

<img width="1280" height="714" alt="image" src="https://img.magnific.com/premium-photo/approved-cybersecurity-login-authentication-with-ai-database-technology-online-privacy_1253175-1095.jpg?semt=ais_hybrid&w=740&q=80" />

## Features

- **JWT access + refresh token flow** — short-lived (15 min) access tokens and long-lived (7 day) refresh tokens
- **Secure password storage** with bcrypt hashing
- **Refresh token rotation** stored server-side per user, invalidated on logout
- **Request validation** with Zod schemas on register/login/refresh
- **Protected routes** via an `authenticate` middleware
- **Mobile client** built with Expo Router, Zustand for auth state, and Expo SecureStore for token storage
- **Automatic token refresh** on the mobile side via an Axios response interceptor (silently retries requests after a 401)

## Tech Stack

**Backend**
- Node.js, Express 5
- PostgreSQL with Sequelize ORM
- JWT (`jsonwebtoken`), `bcrypt`
- Zod for request validation
- CORS, dotenv

**Mobile**
- Expo (SDK 54) + Expo Router
- React Native 0.81
- Zustand for state management
- Axios for API calls
- Expo SecureStore for token persistence

## Project Structure

```
├── backend/
│   ├── config/
│   │   └── database.js          # Sequelize/Postgres connection
│   ├── controllers/
│   │   └── auth.controller.js   # register, login, refresh, logout, getMe
│   ├── middlewares/
│   │   ├── authenticate.js      # verifies access token
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   └── validateAuth.js      # Zod schemas + validation
│   ├── models/
│   │   └── user.js              # User model (fullName, email, password, refreshToken)
│   ├── routes/
│   │   └── auth.routes.js
│   └── server.js
│
└── mobile/
    ├── app/
    │   ├── (auth)/               # login, register screens
    │   └── (app)/                # authenticated screens (home)
    ├── services/
    │   ├── api.js                # Axios instance + refresh interceptor
    │   └── storage.js            # SecureStore helpers
    └── store/
        └── useAuthStore.js       # Zustand auth store
```

## API Endpoints

All routes are prefixed with `/api/auth`.

| Method | Endpoint     | Description                          | Auth required |
|--------|-------------|---------------------------------------|----------------|
| POST   | `/register` | Create a new user account             | No             |
| POST   | `/login`    | Authenticate and receive tokens       | No             |
| POST   | `/refresh`  | Exchange a refresh token for a new access token | No |
| POST   | `/logout`   | Invalidate the stored refresh token   | No             |
| GET    | `/me`       | Get the authenticated user's profile  | Yes (Bearer access token) |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL running locally (or a connection string to a hosted instance)
- Expo CLI / Expo Go app (or an Android/iOS simulator) for the mobile client

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```env
PORT=5000
DB_NAME=marhba
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=127.0.0.1
DB_PORT=5433
JWT_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

Start the server:

```bash
npm run dev     # auto-restarts on changes
# or
npm start
```

The server connects to Postgres, syncs the models, and starts listening on `PORT` (default `5000`).

### Mobile Setup

```bash
cd mobile
npm install
```

Update the API base URL in `mobile/services/api.js` to point to your backend (use your machine's local network IP, not `localhost`, when testing on a physical device):

```js
const API_URL = "http://<your-local-ip>:5000/api";
```

Start the app:

```bash
npx expo start
```

Then open it in Expo Go, an emulator, or a simulator.

## Authentication Flow

1. **Register/Login** — the backend returns an access token, a refresh token, and the user profile. The mobile app stores both tokens in Expo SecureStore.
2. **Authenticated requests** — the Axios instance automatically attaches the access token as a `Bearer` header.
3. **Silent refresh** — if a request returns `401`, the Axios interceptor calls `/api/auth/refresh` with the stored refresh token, stores the new access token, and retries the original request.
4. **Logout** — clears the refresh token server-side and wipes tokens from SecureStore on the client.

## Roadmap / Ideas

- Email verification
- Password reset flow
- Rate limiting on auth routes
- Refresh token rotation with reuse detection
- Social login (Google/Apple)

## License

ISC# Bienvenue
