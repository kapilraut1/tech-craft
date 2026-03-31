# 🏠 Craft Realty — Buyer Portal

A full-stack real-estate buyer portal with JWT authentication, property browsing, and a personal favourites system.

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| **Backend**  | Node.js, Express 5, TypeScript    |
| **Database** | MySQL + TypeORM (auto-sync)       |
| **Auth**     | JWT (jsonwebtoken) + bcryptjs     |
| **Validation** | Zod schemas                     |
| **Frontend** | Vanilla HTML / CSS / JavaScript   |

---

## Project Structure

```
backend-api/
├── public/                 # Frontend (served by Express)
│   ├── index.html          # Single-page app
│   ├── css/style.css       # Design system
│   └── js/app.js           # Client logic
├── src/
│   ├── index.ts            # Express entry point
│   ├── data.source.ts      # TypeORM DataSource (MySQL)
│   ├── env.ts              # Zod-validated env config
│   ├── entities/
│   │   ├── user.entity.ts      # Users table
│   │   ├── property.entity.ts  # Properties table
│   │   └── favourite.entity.ts # Favourites join table
│   ├── middleware/
│   │   └── auth.ts             # JWT verification middleware
│   ├── services/
│   │   ├── auth.service.ts     # Register, login, getUserById
│   │   ├── property.service.ts # CRUD + favourite flag
│   │   └── favourite.service.ts# Toggle + list favourites
│   ├── controller/
│   │   ├── auth.controller.ts
│   │   ├── property.controller.ts
│   │   └── favourite.controller.ts
│   └── routes/
│       ├── auth.route.ts
│       ├── property.route.ts
│       └── favourite.route.ts
├── .env
├── package.json
└── tsconfig.json
```

---

## Prerequisites

- **Node.js** ≥ 18
- **MySQL** server running locally

---

## Setup & Run

### 1. Configure Environment

Edit `.env` in the `backend-api/` folder:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=craft
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:5000
```

### 2. Create the Database

```sql
CREATE DATABASE IF NOT EXISTS craft;
```

> Tables are auto-created by TypeORM (`synchronize: true`).

### 3. Install Dependencies

```bash
cd backend-api
npm install
```

### 4. Start the App

**Development** (with hot-reload):
```bash
npm run dev
```

**Production**:
```bash
npm run build
npm start
```

### 5. Open in Browser

Go to **http://localhost:5000** — the frontend is served directly by Express.

---

## API Endpoints

### Auth

| Method | Endpoint             | Auth? | Description              |
|--------|----------------------|-------|--------------------------|
| POST   | `/api/auth/register` | No    | Create a new user        |
| POST   | `/api/auth/login`    | No    | Login, returns JWT token |
| GET    | `/api/auth/me`       | Yes   | Get current user profile |

### Properties

| Method | Endpoint              | Auth? | Description                         |
|--------|-----------------------|-------|-------------------------------------|
| GET    | `/api/properties`     | Yes   | List all properties (with fav flag) |
| POST   | `/api/properties/add` | Yes   | Add a new property listing          |

### Favourites

| Method | Endpoint                       | Auth? | Description                    |
|--------|--------------------------------|-------|--------------------------------|
| GET    | `/api/favourite`               | Yes   | List current user's favourites |
| POST   | `/api/favourite/:id/favourite` | Yes   | Toggle favourite on/off        |

---

## Example Flows

### Flow 1: Sign Up → Login → Browse

1. Open `http://localhost:5000`
2. Click **"Create one"** to go to the registration form
3. Fill in your name, email, and password (min 6 chars), click **Create Account**
4. You'll be redirected to the login form with your email pre-filled
5. Enter your password and click **Sign In**
6. You'll see the dashboard with all available properties

### Flow 2: Add a Property

1. After logging in, click the **"+ Add Property"** tab
2. Fill in the title, price, and optionally location + image URL
3. Click **"Add Property"**
4. The property appears in the "All Properties" tab

### Flow 3: Favourite / Unfavourite a Property

1. On the "All Properties" tab, click the **🤍 heart button** on any property card
2. The heart turns **❤️ red** and a success toast appears
3. Switch to the **"My Favourites"** tab to see it listed
4. Click the heart again to **remove** it from favourites

### Flow 4: API Usage with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}'
# → Returns: { "token": "eyJ...", "user": {...} }

# Use the token for authenticated requests:
TOKEN="eyJ..."

# Get current user
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/auth/me

# List properties
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/properties

# Add a property
curl -X POST http://localhost:5000/api/properties/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Luxury Villa","price":850000,"location":"Beverly Hills"}'

# Toggle favourite (property id = 1)
curl -X POST -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/favourite/1/favourite

# List my favourites
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/favourite
```

---

## Security Notes

- Passwords are **hashed with bcrypt** (10 rounds) — never stored in plain text.
- JWT tokens expire after **24 hours**.
- Login errors return generic "Invalid email or password" to prevent user enumeration.
- All favourite operations are scoped to the **authenticated user** — users can only see and modify their own favourites.
- Input is validated on both client and server using **Zod schemas**.

---

## Database Schema

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    user       │       │  favourite    │       │   property    │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)      │    ┌──│ id (PK)      │
│ name         │  └───>│ userId (FK)  │    │  │ title        │
│ email (UQ)   │       │ propertyId(FK)│<───┘  │ price        │
│ password_hash│       └──────────────┘       │ location     │
│ role         │                              │ image_url    │
└──────────────┘                              └──────────────┘
```
