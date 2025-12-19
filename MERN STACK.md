# MERN STACK

## Project Summary
- This project is a MERN (MongoDB, Express, React, Node) workout tracker with user authentication. The backend (Express + MongoDB) exposes REST API endpoints and the frontend (React, Vite) consumes those APIs to sign up / log in users and create/read/update/delete workouts.

## Backend (backend/)
- `server.js` — Express app entry; uses `express.json()`, logs requests, mounts routes, connects to MongoDB via `process.env.MONGO_URI`, and listens on `process.env.PORT`.
- `package.json` — backend dependencies and scripts.
- `controllers/`
  - `userController.js` — implements `signupUser` and `loginUser` handlers used by the user routes.
  - `workoutController.js` — implements CRUD handlers: `getWorkouts`, `getWorkout`, `createWorkout`, `deleteWorkout`, `updateWorkout`.
- `middleware/`
  - `requireAuth.js` — authentication middleware that protects routes (used for workout routes).
- `models/`
  - `userModel.js` — Mongoose schema/model for users.
  - `workoutModel.js` — Mongoose schema/model for workouts.
- `routes/`
  - `user.js` — routes for user actions: `POST /login` and `POST /signup` (mapped to controllers).
  - `workouts.js` — protected routes for workouts: mounted under `/api/workouts` and supporting `GET /`, `GET /:id`, `POST /`, `DELETE /:id`, `PATCH /:id`.

## Frontend (frontend/)
- Vite + React app (see `package.json`, `vite.config.js`). The dev server proxied `/api` to the backend.
- `vite.config.js` — dev server proxy: `/api` -> `http://localhost:4000` (backend). This allows frontend code to call `/api/...` without specifying the backend origin in development.
- `index.html`, `src/main.jsx`, `src/App.jsx` — app entry and root component.
- `src/components/`
  - `Navbar.jsx` — top navigation.
  - `WorkoutDetails.jsx` — displays a workout and likely issues DELETE requests to `/api/workouts/:id`.
  - `WorkoutForm.jsx` — form to create workouts (POST `/api/workouts`).
- `src/pages/` — page components: `Home.jsx`, `Login.jsx`, `Signup.jsx`, `Landing.jsx`, `About.jsx`, `NotFound.jsx`.
- `src/context/`
  - `AuthContext.jsx` — manages auth state (login/logout) and persists user in `localStorage`.
  - `WorkoutContext.jsx` — holds workouts state and dispatch for app-wide updates.
- `src/hooks/`
  - `useAuthContext.jsx` — helper to access `AuthContext`.
  - `useLogin.jsx` — performs `fetch('/api/user/login', { method: 'POST', ... })`, stores user in `localStorage`, and dispatches `LOGIN` to `AuthContext`.
  - `useLogout.jsx`, `useSignup.jsx` — (similar) handle auth flows.
  - `useWorkoutsContext.jsx` — helper to access `WorkoutContext`.

## How the frontend connects to the backend
- API base path: the backend mounts routes under `/api` (see `server.js`). Key endpoints:
  - `POST /api/user/login` — log in (handled by `backend/routes/user.js` -> `controllers/userController.js`).
  - `POST /api/user/signup` — register (same files).
  - `GET /api/workouts` — list workouts (protected by `requireAuth`).
  - `GET /api/workouts/:id`, `POST /api/workouts`, `PATCH /api/workouts/:id`, `DELETE /api/workouts/:id` — workout CRUD endpoints (defined in `backend/routes/workouts.js` -> `controllers/workoutController.js`).
- Dev-time proxying: `frontend/vite.config.js` proxies any request starting with `/api` to `http://localhost:4000`. This means frontend code can call relative paths like `/api/user/login` (as shown in `src/hooks/useLogin.jsx`) and Vite will forward them to the backend server running on port `4000`.
- Authentication: `requireAuth` middleware protects workout routes on the backend; the frontend stores the logged-in user/token in `localStorage` (via `AuthContext`) and includes auth info (e.g., `Authorization` header or token payload) when calling protected endpoints as implemented in components/hooks.

## Where requests are initiated in the frontend (examples)
- `src/hooks/useLogin.jsx` — sends `POST /api/user/login` to authenticate a user.
- `src/components/WorkoutForm.jsx` — typically sends `POST /api/workouts` to create a workout.
- `src/components/WorkoutDetails.jsx` — typically issues `DELETE /api/workouts/:id` to remove a workout.
- Contexts (`src/context/AuthContext.jsx`, `src/context/WorkoutContext.jsx`) manage local state and coordinate API calls and UI updates via dispatch actions.

## Environment & running notes
- Backend expects `MONGO_URI` and `PORT` environment variables (see `backend/server.js`).
- Frontend dev server proxies `/api` to `http://localhost:4000` so API calls in code can use relative `/api/...` paths during development.

---

If you'd like, I can also:
- add specific file links into this document, or
- update the README with commands to run backend and frontend together.

