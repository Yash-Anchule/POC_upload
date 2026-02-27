# POC Showcase Platform

A full-stack web application to manage and showcase company Proof of Concept (POC) projects.

This repository contains:
- `client/`: React + Vite frontend
- `server/`: Node.js + Express + MongoDB backend

## Features

- User authentication with JWT access/refresh tokens
- Role-based access control (`admin`, `developer`, `viewer`)
- POC CRUD with search, tag filtering, status filtering, and pagination
- Thumbnail image upload for POCs
- Admin user management (create/update/delete users)
- Responsive dashboard UI

## Tech Stack

### Frontend
- React 19
- Vite 7
- React Router
- Zustand
- Axios
- Tailwind CSS

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- Zod validation
- Multer (file uploads)
- JWT auth
- Helmet, CORS, rate limiting, NoSQL sanitization

## Project Structure

```text
POC-git/
  client/
    src/
      components/
      pages/
      services/
      store/
  server/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    validators/
    utils/
```

## Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- npm

## Environment Variables

Create `server/.env` with:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/poc_showcase
CLIENT_URL=http://localhost:5173

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

## Local Setup

### 1. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Run backend

```bash
cd server
npm run dev
```

Backend runs at `http://localhost:5000`.

### 3. Run frontend

```bash
cd client
npm run dev
```

Frontend runs at `http://localhost:5173`.

Vite proxies `/api` and `/uploads` to backend port `5000`.

## Default Admin Seed

To create a default admin account:

```bash
cd server
node utils/seedAdmin.js
```

Default credentials:
- Email: `admin@pocshowcase.com`
- Password: `admin123`

Change this immediately in real environments.

## API Overview

Base URL: `/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout` (auth required)
- `GET /auth/me` (auth required)

### Users (Admin only)
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

### POCs
- `GET /pocs` (auth required)
- `GET /pocs/:id` (auth required)
- `POST /pocs` (admin/developer)
- `PUT /pocs/:id` (admin/developer)
- `DELETE /pocs/:id` (admin/developer)

`GET /pocs` query params:
- `page` (default `1`)
- `limit` (default `10`)
- `search` (title/description)
- `tag` (comma-separated)
- `status` (`draft|published`)
- `author` (user id)

## Roles and Permissions

- `admin`: Full access to users and POCs.
- `developer`: Create/update/delete own POCs.
- `viewer`: View POCs only.

## Security Notes

- Access token sent via `Authorization: Bearer <token>`
- Refresh token stored in frontend localStorage in current implementation
- Auth endpoints protected by rate limiter
- Helmet and request sanitization enabled

## Build

### Frontend

```bash
cd client
npm run build
npm run preview
```

### Backend (production)

```bash
cd server
npm start
```

## Troubleshooting

### Error: `Cannot set property query of #<IncomingMessage> which has only a getter`

Cause: Express 5 incompatibility when middleware mutates `req.query` directly.

Status in this repo: fixed by using Express-5-safe sanitization in `server/server.js`.

### Error: `Cannot read properties of undefined (reading 'dryRun')`

Cause: calling `mongoSanitize.sanitize()` without options.

Status in this repo: fixed by passing options object (`{}`).

## GitHub

Repository: `https://github.com/NaveenReddy7013/POC-git.git`

## License

ISC



