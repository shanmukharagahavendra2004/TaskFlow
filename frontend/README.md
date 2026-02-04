# TaskFlow — Frontend (React JSX + Tailwind CSS)

> **No Vite.**  The project uses **react-scripts 5** (webpack + Babel under the hood).  
> Tailwind is wired through PostCSS — `react-scripts` picks up `postcss.config.js` automatically.

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
