# Deployment Guide - Personal CA Bot

This guide outlines the steps to deploy the Personal CA Bot to production. 

## 🏗 High-Level Architecture
- **Frontend**: Next.js (Tailwind + Framer Motion) → Deployed to **Vercel**.
- **Backend**: FastAPI (Python) → Deployed to **Render** or **Railway**.
- **Database**: SQLite (Development) → Transition to **PostgreSQL** (Production).

---

## 🔼 Step 1: Backend Deployment (Render / Railway)

### 1. Database Update (Postgres)
In production, SQLite files are often wiped on each deploy. Update `database.py` to use a connection string from an environment variable:

```python
# app/core/database.py
import os
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ca_bot.db")
```

### 2. Create `requirements.txt`
Ensure you have all dependencies listed:
```bash
uvicorn
fastapi
sqlalchemy
pydantic
```

### 3. Deployment Config
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## 🎨 Step 2: Frontend Deployment (Vercel)

### 1. Environment Variables
Update your API calls in the frontend to use an environment variable instead of `localhost:8000`:

```typescript
// Example in BudgetOverview.tsx
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
fetch(`${API_URL}/api/budget`)
```

### 2. Deploy to Vercel
1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Add the `NEXT_PUBLIC_API_URL` environment variable pointing to your deployed backend URL.

---

## 🔐 Step 3: Production Checklist

- [ ] **CORS Settings**: In `main.py`, update `allow_origins=["*"]` to only allow your Vercel frontend URL.
- [ ] **Security**: Implement JWT Authentication for multiple users.
- [ ] **Persistence**: Ensure your PostgreSQL database is backed up.
- [ ] **Disclaimers**: Keep the financial advice disclaimer visible as per regulations.

---

## 🛠 Self-Hosting (Docker)
If you prefer a single server deployment, use **Docker Compose**:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    env_file: .env
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://your-server-ip:8000
```
