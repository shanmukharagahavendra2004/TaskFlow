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
