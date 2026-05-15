# 🛠️ Mini Service Request Board

> A full-stack job portal for posting and managing local service requests. Built with **Next.js 16**, **Express 5**, and **MongoDB**.

---

## 📸 Screenshots

### Home — Service Requests Board
![Home Page](./images/home.png)

### Job Detail Page
![Job Detail](./images/job.png)

### Post a New Job
![Create Job](./images/create_job.png)

### Login
![Login](./images/login.png)

### Register
![Register](./images/register.png)

---

## ✨ Features

- 📋 **Browse service requests** — view all open jobs with category, location, and status at a glance
- 🔍 **Filter & search** — filter by category (Plumbing, Electrical, Painting, Joinery, Other) or keyword search across titles and descriptions
- ➕ **Post a job** — authenticated users can create new service requests
- 🔄 **Status management** — update job status between Open, In Progress, and Closed
- 🗑️ **Delete jobs** — authenticated users can remove their own listings
- 🔐 **JWT Authentication** — secure register/login with protected routes
- 🧪 **Full test suite** — Jest + Supertest integration tests for the entire API

---

## 🏗️ Project Structure

```
Job Portal/
├── backend/          # Express + MongoDB REST API
│   ├── scripts/      # Database seeding
│   └── src/          # App source (routes, controllers, models)
├── frontend/         # Next.js 16 + Tailwind CSS UI
│   └── app/          # App router pages (home, jobs, create, login, register)
├── images/           # App screenshots
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repo

```bash
git clone https://github.com/AshenIndeewara/Job-Portal.git
cd Job-Portal
```

### 2. Start the Backend

```bash
cd backend
cp .env.example .env    # fill in MONGODB_URI and PORT
npm install
npm run seed            # optional: load sample data
npm run dev             # starts on http://localhost:5000
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev             # starts on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 16, React 19, Tailwind CSS 4 |
| Backend    | Node.js, Express 5                  |
| Database   | MongoDB, Mongoose                   |
| Auth       | JWT (jsonwebtoken), bcryptjs        |
| Testing    | Jest, Supertest                     |
| HTTP Client| Axios                               |

---

## 📂 Sub-project READMEs

- **[Backend README](./backend/README.md)** — API reference, environment setup, auth docs, and test guide
- **[Frontend README](./frontend/README.md)** — Next.js app structure, pages, and development guide

---
