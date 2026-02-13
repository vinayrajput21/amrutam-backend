# Amrutam Telemedicine Backend

Production-grade REST API backend for Amrutam's telemedicine platform.

Built with **Node.js**, **Express**, **PostgreSQL (Neon)**, **Redis**, **BullMQ**, **JWT + MFA**, **Sequelize ORM**, **Awilix DI**, **Prometheus metrics**, **OpenTelemetry tracing**, **Winston logging**, **Swagger docs**, **Jest tests**.

Designed for:

- 100k daily consultations
- p95 latency <200ms (reads) / <500ms (writes)
- 99.95% availability
- Strong security (RBAC, MFA, encryption, idempotency, rate limiting, OWASP mitigations)

---

## Tech Stack

- **Language:** Node.js 20
- **Framework:** Express
- **Database:** PostgreSQL (Neon serverless)
- **Cache/Queue:** Redis + BullMQ
- **Auth:** JWT + TOTP MFA (speakeasy)
- **ORM:** Sequelize
- **DI:** Awilix (scoped per request)
- **Observability:** Prometheus metrics, OpenTelemetry traces, Winston logs
- **API Docs:** Swagger / OpenAPI 3.0
- **Testing:** Jest + Supertest
- **Security:** Helmet, express-rate-limit, Joi validation, AES-256-GCM encryption
- **Infra:** Docker Compose (local), container-ready

---

# Quick Start (Local Development)

## Prerequisites

- Node.js ≥ 20
- Docker & Docker Compose (for Redis)
- Neon PostgreSQL database (free tier sufficient)

---

## 1. Clone & Install

```bash
git clone <your-repo-url>
cd amrutam-telemedicine-backend
npm install
```

---

## 2. Environment Variables

Create `.env.development` in the root:

```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# Neon PostgreSQL
DATABASE_URL=postgres://user:password@ep-xxx.us-east-2.aws.neon.tech/amrutam_dev?sslmode=require

# Redis (local Docker)
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-very-long-random-secret-min-64-chars
ENCRYPTION_KEY=your-64-hex-char-key-0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

---

## 3. Start Redis (Docker)

```bash
docker compose up -d redis
```

---

## 4. Run Migrations (Create Tables in Neon)

```bash
npx sequelize-cli db:migrate
```

---

## 5. Start Server

```bash
npm run dev
```

Server runs on:

- API → http://localhost:3000
- API Docs → http://localhost:3000/api-docs
- Metrics → http://localhost:9090/metrics
- Health Check → http://localhost:3000/api/health

---

# Project Structure

```
src/
├── config/          # env, db, redis
├── controllers/     # route handlers
├── middlewares/     # auth, rbac, validation, rate-limit, error
├── models/          # Sequelize models + associations
├── routes/          # Express routers + Swagger JSDoc
├── services/        # business logic + DI-ready classes
├── utils/           # logger, crypto, metrics, tracer, idempotency
└── server.js        # entry point
```

---

# Core Features Implemented

- User lifecycle (register, login, MFA, profiles, role assignment)
- Doctor availability slots + search/filter
- Idempotent booking + consultation lifecycle
- Prescription creation (encrypted) + async notification jobs
- Admin analytics (daily stats, user/doctor performance)
- Full audit logging
- RBAC, rate limiting, input validation, Helmet
- Observability:
  - Metrics (Prometheus)
  - Traces (OpenTelemetry)
  - Logs (Winston)
- Swagger OpenAPI documentation
- Jest integration tests

---

# Observability

- **Metrics** — Prometheus format at `/metrics` (port 9090)
- **Logs** — Structured JSON + console (stored in `logs/` folder)
- **Traces** — OpenTelemetry auto-instrumentation

---

# Security Highlights

See:

- `docs/security-checklist.md`
- `docs/threat-model.md`

---

# Deployment Notes

- Ready for Docker / Kubernetes
- Use Neon for DB
- Use Upstash / Redis Cloud for Redis in production
- Secrets via environment variables or secrets manager
- CI/CD via GitHub Actions (see `.github/workflows/ci.yml`)

---

# Running Tests

```bash
npm test
```

---

# Demo Video

A 5-minute demo video is submitted separately.

Link: `[insert-your-video-link-here]`

---

# OpenAPI Schema

You can export the Swagger JSON from:

```
http://localhost:3000/api-docs
```

Download as YAML and place it in:

```
docs/openapi.yaml
```

Or use this minimal starter:

```yaml
openapi: 3.0.0
info:
  title: Amrutam Telemedicine API
  version: 1.0.0
  description: Production-grade backend for Amrutam's telemedicine platform

servers:
  - url: http://localhost:3000/api
    description: Local development
  - url: https://api.amrutam.example.com
    description: Production

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

paths:
  /auth/register:
    post:
      summary: Register new user
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email:
                  type: string
                password:
                  type: string
      responses:
        '201':
          description: Created

  /auth/login:
    post:
      summary: Login and get JWT
      security: []
      responses:
        '200':
          description: Success
```

---

**Made with focus on scalability, reliability, security & observability — Senior Backend Engineer level.**
