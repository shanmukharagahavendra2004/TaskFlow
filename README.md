# TaskFlow
Built a full-stack task manager with a FastAPI backend and a React + Tailwind frontend. It supports secure user login/signup with JWT, role-based access, and full task CRUD with priority, status, pagination, and ownership checks. Designed with async PostgreSQL, clean validation, and a modular, production-ready architecture.

# TaskFlow — Frontend (React JSX + Tailwind CSS)

---

## Tech Stack

| Layer | Tool |
|---|---|
| Runtime | React 18 |
| Language | JavaScript (JSX) |
| Bundler / dev-server | react-scripts 5 (webpack) |
| CSS | Tailwind CSS 3 via PostCSS |
| Router | React Router v6 |
| HTTP client | Axios |
| Fonts | Outfit (display), DM Sans (body), JetBrains Mono (mono) |

---

## 1. Quick Start

```bash
cd frontend

# 1. Install
npm install

# 2. Make sure the FastAPI backend is running on :8000
#    (or edit .env → REACT_APP_API_BASE_URL)

# 3. Start the dev server
npm start          # → http://localhost:3000
```

### Production build

```bash
npm run build      # → /build
```

Serve the `/build` folder with any static host (Vercel, Netlify, nginx, …).

---

## 2. Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `REACT_APP_API_BASE_URL` | `http://localhost:8000/api/v1` | Base URL that Axios prepends to every request |

Edit `.env` before `npm start` to point at a different backend.

---

## 3. Project Layout

```
frontend/
├── public/
│   └── index.html              # Google Fonts link lives here
├── src/
│   ├── index.js                # React 18 createRoot entry
│   ├── App.js                  # <Routes> tree
│   ├── index.css               # @tailwind directives + reusable component classes
│   ├── types.js                # badge-colour maps & select-option arrays
│   │
│   ├── utils/
│   │   └── token.js            # in-memory JWT get / set / clear
│   │
│   ├── services/
│   │   ├── api.js              # Axios instance + interceptors
│   │   ├── authService.js      # register / login / getMe
│   │   └── taskService.js      # CRUD helpers
│   │
│   ├── context/
│   │   └── AuthContext.jsx     # global user state + useAuth() hook
│   │
│   ├── components/
│   │   ├── Navbar.jsx          # sticky top nav
│   │   ├── ProtectedRoute.jsx  # redirect-if-unauthed wrapper
│   │   └── Toast.jsx           # slide-in success / error banner
│   │
│   └── pages/
│       ├── Login.jsx           # sign-in form
│       ├── Register.jsx        # sign-up form (with client validation)
│       └── Dashboard.jsx       # task list + create/edit/delete modals
│
├── tailwind.config.js          # colours, fonts, shadows, animations
├── postcss.config.js           # tailwindcss + autoprefixer
├── package.json
├── .env                        # REACT_APP_API_BASE_URL
└── README.md
```

---

## 4. Routes

| Path | Auth required | Page |
|---|---|---|
| `/login` | No | Login form |
| `/register` | No | Registration form |
| `/dashboard` | Yes (JWT) | Task list & CRUD |
| `/` | — | Redirects based on auth state |

---

## 5. How Auth Works

1. User submits Login or Register form.
2. Backend responds with `{ access_token, user }` inside the standard envelope.
3. `AuthContext` calls `setToken(access_token)` (stored in a module-level variable) and puts `user` into React state.
4. The Axios **request interceptor** reads that token and attaches `Authorization: Bearer …` to every outgoing request.
5. `<ProtectedRoute>` checks `user` in context — redirects to `/login` when it is `null`.
6. Logout clears the token and nulls the user.

> **Security note:** the token is kept in memory only (no `localStorage`).  
> For production, prefer an **httpOnly cookie** set by the backend.

---

## 6. Tailwind Conventions

* **Custom colours** (`primary-*`, `slate-850/900/950`) are defined in `tailwind.config.js`.
* **Reusable classes** (`input-base`, `input-dark`, `btn-primary`, `btn-sm-primary`, `btn-sm-danger`, `btn-outline`, `badge`, `card`, `label`) live in the `@layer components` block in `index.css`.
* **Animations** (`animate-slide-up`, `animate-slide-down`, `animate-toast-in`, `animate-fade-in`) are declared as keyframes + utility in the config.


# Task Manager – Backend (FastAPI)

## Tech Stack
| Layer | Tool |
|---|---|
| Framework | FastAPI 1.0 |
| ORM | SQLAlchemy 2 (async) |
| DB driver | asyncpg |
| Migrations | Alembic |
| Auth | JWT via python-jose + bcrypt via passlib |
| DB | PostgreSQL 15+ |

---

## 1. Quick Start

```bash
# 1. Clone & enter the backend folder
git clone <repo-url>
cd backend

# 2. Create & activate a virtual environment
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy env template and fill in your values
cp .env.example .env

# 5. Make sure PostgreSQL is running and the database exists
#    psql -U <user> -c "CREATE DATABASE taskdb;"

# 6. Run migrations
alembic upgrade head

# 7. Start the dev server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Swagger UI → http://localhost:8000/docs
Health check → http://localhost:8000/health

---

## 2. Project Layout

```
backend/
├── main.py                  # uvicorn entry-point
├── alembic.ini
├── requirements.txt
├── .env.example
├── alembic/
│   ├── env.py               # async-aware migration runner
│   └── versions/
│       └── 0001_initial.py  # users + tasks tables
└── app/
    ├── main.py              # FastAPI factory, CORS, routers
    ├── config.py            # Pydantic Settings (env vars)
    ├── database.py          # async engine, session, Base
    ├── models/
    │   ├── user.py          # User ORM model
    │   └── task.py          # Task ORM model
    ├── schemas/
    │   ├── user.py          # Register / Login / response schemas
    │   └── task.py          # CRUD request / response schemas
    ├── routers/
    │   ├── auth.py          # /api/v1/auth/*
    │   └── tasks.py         # /api/v1/tasks/*
    ├── services/
    │   ├── auth_service.py  # registration & login logic
    │   └── task_service.py  # CRUD + ownership enforcement
    ├── middleware/
    │   └── auth.py          # get_current_user / get_current_admin deps
    └── utils/
        ├── hashing.py       # bcrypt + JWT sign/verify
        └── response.py      # uniform JSON envelope helpers
```

---

## 3. API Reference

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/auth/register` | – | Register a new user |
| POST | `/api/v1/auth/login` | – | Login & receive JWT |
| GET | `/api/v1/auth/me` | JWT | Return current user |

### Tasks

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/tasks/` | JWT | Create a task |
| GET | `/api/v1/tasks/` | JWT | List tasks (paginated) |
| GET | `/api/v1/tasks/{id}` | JWT | Get single task |
| PUT | `/api/v1/tasks/{id}` | JWT | Update task |
| DELETE | `/api/v1/tasks/{id}` | JWT | Delete task |

> **Roles** – `user` sees only their own tasks; `admin` sees all.

---

## 4. Security Notes

* Passwords hashed with **bcrypt** (12 rounds by default).
* JWTs signed with **HS256**; change `JWT_SECRET_KEY` in production.
* All inputs validated by **Pydantic v2** schemas before hitting the DB.
* SQL injection is impossible – every query uses parameterised SQLAlchemy statements.
* CORS origins are explicitly configured; wildcard `*` is never used in production.

---

## 5. Scalability Notes

* **Async engine** – I/O-bound DB calls never block the event loop.
* **Layered architecture** (router → service → model) makes adding new resources a copy-paste exercise.
* **Alembic migrations** keep the schema in version control.
* **Connection pooling** (`pool_size=10, max_overflow=20`) is ready for production tuning.
