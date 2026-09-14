# 📱 MyDay — Todos & Daily Expense Tracker

A full-stack, installable **Progressive Web App** for managing daily tasks and tracking expenses — built to run on your phone and showcase full-stack engineering skills.

> **Live demo:** _add your deployed link here after deploying_
> **Tech:** React · TypeScript · Spring Boot · MySQL · JWT

---

## ✨ Features

### ✅ Todos
- Create, edit, and delete tasks
- **Progress tracking** — set completion 0–100% via a slider, `+`/`−` steppers, or a one-tap **✓ Done**
- **Priority** levels (High / Medium / Low) with color tags
- Filter (All / Active / Done), **search**, and **sort** (newest, due date, progress, priority)

### 💰 Daily Expenses
- Add / edit / delete expenses (amount, category, note, date)
- **Summary** cards: total today and total this month
- **Category donut chart** of monthly spending
- **Monthly budget** with a live progress bar and over-budget alerts
- **View any single day's** expenses with a day total
- Search and sort (by date or amount)

### 🔐 Accounts & Platform
- Register / login with **JWT authentication** (passwords hashed with BCrypt)
- Each user sees only their own data; data syncs across devices
- **Dark mode** (persisted)
- **Installable PWA** — add to your phone's home screen, works offline (app shell)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite, React Router, Axios, `vite-plugin-pwa` |
| **Backend** | Java 21, Spring Boot 3.5, Spring Web, Spring Data JPA, Spring Security |
| **Auth** | JWT (JJWT), BCrypt password hashing |
| **Database** | MySQL 8 |
| **Build** | Maven (backend), npm/Vite (frontend) |

---

## 🏗️ Architecture

```
┌────────────────┐    HTTPS / JSON     ┌────────────────────────┐    JDBC    ┌─────────┐
│  React PWA     │  ─────────────────▶ │  Spring Boot REST API   │ ─────────▶ │  MySQL  │
│  (phone/web)   │  ◀───────────────── │  Controller → Service   │ ◀───────── │         │
│  JWT in header │                     │       → Repository       │            │         │
└────────────────┘                     └────────────────────────┘            └─────────┘
```

The backend follows a layered architecture (Controller → Service → Repository) with DTOs, bean validation, and centralized exception handling. All queries are scoped to the authenticated user.

---

## 📁 Project Structure

```
myday/
├── backend/                 # Spring Boot REST API
│   └── src/main/java/com/myday/
│       ├── config/          # Security & CORS configuration
│       ├── security/        # JWT service, filter, user principal
│       ├── user/            # Auth + profile (register, login, budget)
│       ├── todo/            # Todo entity, repository, service, controller
│       ├── expense/         # Expense entity, repository, service, controller
│       └── common/          # Global exception handling
└── frontend/                # React + TypeScript PWA
    └── src/
        ├── api/             # Axios client + API calls
        ├── auth/            # Auth context + protected routes
        ├── components/      # Layout, tab bar, chart, toasts, confirm dialog
        ├── pages/           # Login, Register, Todos, Expenses, Profile
        └── theme/           # Dark-mode context
```

---

## 🚀 Getting Started (run locally)

### Prerequisites
- **Java 21+** and **MySQL 8** running locally
- **Node.js 20+**

### 1. Database
Create the database (or let the app auto-create it):
```sql
CREATE DATABASE myday;
```

### 2. Backend
Set the required environment variables (never commit secrets), then run:

```bash
cd backend

# Windows (PowerShell)
$env:DB_USERNAME="root"; $env:DB_PASSWORD="yourpassword"
$env:JWT_SECRET="a-long-random-secret-at-least-32-chars"

./mvnw spring-boot:run
```

The API starts on **http://localhost:8080**.

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` / `DB_PORT` / `DB_NAME` | MySQL connection | `localhost` / `3306` / `myday` |
| `DB_USERNAME` / `DB_PASSWORD` | MySQL credentials | `root` / _(empty)_ |
| `JWT_SECRET` | Signing key for JWTs | dev placeholder |
| `CORS_ORIGINS` | Allowed frontend origin(s) | `http://localhost:5173` |

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173**. To test on your phone, open the **Network URL** Vite prints (same Wi-Fi).

Configure the API URL in `frontend/.env`:
```
VITE_API_URL=http://localhost:8080
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create account, returns JWT |
| `POST` | `/api/auth/login` | Log in, returns JWT |
| `GET` | `/api/profile` | Current user profile + budget |
| `PUT` | `/api/profile/budget` | Update monthly budget |
| `GET/POST` | `/api/todos` | List / create todos |
| `PUT/DELETE` | `/api/todos/{id}` | Update / delete a todo |
| `GET/POST` | `/api/expenses` | List / create expenses |
| `PUT/DELETE` | `/api/expenses/{id}` | Update / delete an expense |
| `GET` | `/api/expenses/summary` | Today / month / per-category totals |

All endpoints except `/api/auth/**` require an `Authorization: Bearer <token>` header.

---

## 📷 Screenshots

_Add screenshots of the Todos, Expenses, and dark-mode screens here._

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

info for Design prompt
I want you to redesign my existing application UI to look like a
premium, professionally designed production-level application.

I will provide reference images and screenshots of my current
application. Carefully analyze the references and improve my UI
based on the design principles below.

DESIGN GOAL:
Create a sophisticated, elegant, modern, and premium user interface.
The application should look like it was designed by an experienced
professional product designer, not like a basic beginner project.

1. COLOR PALETTE:
- Use a subtle, sophisticated, and limited color palette.
- Choose one primary brand color and build the entire design around it.
- Use neutral colors for backgrounds, cards, borders, and text.
- Avoid mixing too many colors.
- Avoid bright, childish, or highly saturated colors.
- Avoid unnecessary gradients and excessive visual effects.
- Maintain excellent contrast and readability.
- Use colors consistently across every page and component.
- Use a maximum of one primary brand color, neutral colors, and
  carefully selected semantic colors for success, warning, and errors.

2. PREMIUM VISUAL STYLE:
- Use generous whitespace and balanced spacing.
- Create clean layouts with excellent visual hierarchy.
- Use subtle borders and soft shadows only where necessary.
- Use consistent border-radius values.
- Use elegant typography and carefully selected font sizes.
- Make cards, buttons, forms, tables, and navigation look polished.
- Maintain a consistent design language across the entire application.
- Avoid unnecessary decorative elements.

3. USER EXPERIENCE:
- Make the application intuitive and easy to navigate.
- Improve the placement of buttons, forms, menus, and important actions.
- Ensure the most important information is visually prominent.
- Make the interface responsive for desktop, tablet, and mobile.
- Provide clear loading, empty, success, and error states.
- Make all interactive elements feel consistent and professional.

4. REFERENCE ANALYSIS:
- Carefully study the reference images I provide.
- Identify their color palette, typography, spacing, layout,
  card design, navigation style, and overall visual language.
- Use the references as inspiration, but do not blindly copy them.
- Adapt the design to suit my application's purpose and users.

5. IMPLEMENTATION:
- First inspect my existing project structure and understand the
  current UI before making changes.
- Identify the frontend framework and existing components.
- Preserve all existing business logic, API integrations, routing,
  authentication, and functionality.
- Do not break existing features.
- Improve the UI without unnecessarily rewriting the entire
  application.
- Create reusable components and maintainable styling.
- Use a centralized theme or design system for colors, typography,
  spacing, and component styles.
- Ensure the final implementation is clean and production-ready.

IMPORTANT:
Do not start coding immediately.

First:
1. Analyze my existing application.
2. Analyze the reference images.
3. Recommend a suitable premium color palette.
4. Explain the design direction and visual hierarchy.
5. Identify the pages and components that need improvement.
6. Show me the proposed design approach.

Wait for my approval before implementing the changes.

The final result should feel premium, calm, modern, consistent,
and professionally designed—not colorful, crowded, or over-designed.
