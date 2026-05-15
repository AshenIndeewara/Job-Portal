# ⚙️ Backend API

Express 5 + MongoDB REST API for the Job Portal.

---

## 📸 App Preview

### Service Requests Board
![Home Page](../images/home.png)

### Job Detail with Status Management
![Job Detail](../images/job.png)

---

## 🛠️ Tech Stack

| Tool         | Version | Purpose                        |
|--------------|---------|--------------------------------|
| Node.js      | 18+     | Runtime                        |
| Express      | 5.x     | REST API framework             |
| MongoDB      | —       | Database                       |
| Mongoose     | 8.x     | ODM / schema validation        |
| jsonwebtoken | 9.x     | JWT auth                       |
| bcryptjs     | 3.x     | Password hashing               |
| Jest         | 30.x    | Test runner                    |
| Supertest    | 7.x     | HTTP integration testing       |
| nodemon      | 3.x     | Dev auto-restart               |

---

## 📁 Project Structure

```
backend/
├── scripts/
│   └── seed.js                 # Inserts 10 sample job requests
└── src/
    ├── app.js                  # Express app (no server start — testable)
    ├── index.js                # DB connect + server start
    ├── __tests__/
    │   └── jobs.test.js        # Full API integration tests
    ├── controllers/
    │   └── jobsController.js   # Route handlers
    ├── middleware/
    │   └── errorHandler.js     # 404 + global error handler
    ├── models/
    │   └── JobRequest.js       # Mongoose schema + validation
    └── routes/
        └── jobs.js             # Route definitions
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and set your values:

```bash
cp .env.example .env
```

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/JobPortal
JWT_SECRET=your_jwt_secret_here
```

**MongoDB Atlas** — replace `MONGODB_URI` with your Atlas connection string:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/JobPortal
```

---

## 🚀 Setup & Run

```bash
# Install dependencies
npm install

# Development mode (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:5000` (or the `PORT` set in `.env`).

---

## 🌱 Seed Sample Data

```bash
npm run seed
```

Clears the collection and inserts **10 sample job requests** across different categories and statuses (Plumbing, Electrical, Painting, Joinery).

---

## 📡 API Reference

Base URL: `http://localhost:5000`

### Jobs

| Method   | Endpoint              | Auth     | Description                        |
|----------|-----------------------|----------|------------------------------------|
| `GET`    | `/api/jobs`           | No       | List all jobs                      |
| `GET`    | `/api/jobs?category=` | No       | Filter by category                 |
| `GET`    | `/api/jobs?status=`   | No       | Filter by status                   |
| `GET`    | `/api/jobs?search=`   | No       | Full-text search (title + desc)    |
| `GET`    | `/api/jobs/:id`       | No       | Get a single job                   |
| `POST`   | `/api/jobs`           | **Yes**  | Create a new job                   |
| `PATCH`  | `/api/jobs/:id`       | No       | Update job status                  |
| `DELETE` | `/api/jobs/:id`       | **Yes**  | Delete a job                       |
| `GET`    | `/health`             | No       | Health check                       |

### Auth

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| `POST` | `/api/auth/register`  | Register a new user            |
| `POST` | `/api/auth/login`     | Log in and receive a JWT token |
| `GET`  | `/api/auth/me`        | Get current user (requires JWT)|

---

## 📝 Request / Response Examples

### `POST /api/jobs` — Create a Job

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Leaking kitchen tap",
  "description": "Dripping non-stop for two weeks",
  "category": "Plumbing",
  "location": "Glasgow",
  "contactName": "Jane Doe",
  "contactEmail": "jane@gmail.com"
}
```

**Validation rules:**
- `title` and `description` — **required**
- `category` — must be one of: `Plumbing` | `Electrical` | `Painting` | `Joinery` | `Other`
- `contactEmail` — must be a valid email
- `status` — defaults to `"Open"`

---

### `PATCH /api/jobs/:id` — Update Status

**Body:**
```json
{ "status": "In Progress" }
```

Allowed values: `"Open"` | `"In Progress"` | `"Closed"`

---

### `POST /api/auth/register`

**Body:**
```json
{ "name": "Jane Doe", "email": "jane@gmail.com", "password": "password123" }
```

**Response:**
```json
{ "token": "...", "user": { "id": "...", "name": "Jane Doe", "email": "jane@gmail.com" } }
```

---

### `POST /api/auth/login`

**Body:**
```json
{ "email": "jane@gmail.com", "password": "password123" }
```

**Response:**
```json
{ "token": "...", "user": { "id": "...", "name": "Jane Doe", "email": "jane@gmail.com" } }
```

---

### `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{ "user": { "id": "...", "name": "Jane Doe", "email": "jane@gmail.com" } }
```

---

## 🔍 Keyword Search

```bash
GET /api/jobs?search=leaking tap
```

Searches across `title` and `description` using MongoDB full-text index. Combine with other filters:

```bash
GET /api/jobs?search=tap&category=Plumbing&status=Open
```

---

## 🧪 Tests

```bash
npm test
```

Tests run against a separate `job_portal_test` database and clean up after each run.

**Test coverage:**

| Endpoint            | Test Cases                                               |
|---------------------|----------------------------------------------------------|
| `POST /api/jobs`    | Create, validation errors, bad email, missing fields     |
| `GET /api/jobs`     | List all, filter by category, filter by status           |
| `GET /api/jobs/:id` | Found, 404, malformed ID                                 |
| `PATCH /api/jobs/:id`| Status update, invalid status, missing field, 404       |
| `DELETE /api/jobs/:id`| Success, 404                                           |

---

## 🔗 Related

- [Frontend README](../frontend/README.md) — Next.js app, pages, and UI guide
- [Main README](../README.md) — Project overview and quick start
