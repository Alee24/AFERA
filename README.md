# Afera University - Student Management System & Website

A production-ready Student Management System (SMS) combined with a modern university website.

## Tech Stack
- **Frontend**: Next.js 15, TypeScript, i18next, Vanilla CSS
- **Backend**: Node.js, Express, TypeScript, Sequelize (MySQL)
- **Database**: MySQL
- **DevOps**: Docker, Docker Compose

## Features
- **Multi-language Support**: English, French, Portuguese.
- **Role-Based Access Control**: Admin, Student, Lecturer.
- **Course Management**: CRUD for courses with multilingual content.
- **Blog System**: Content publishing with PDF/PPT previews.
- **Messaging**: Secure communication between users.
- **File Preview**: Embedded viewers for PDF and PowerPoint.

## Local Development

### 1. Backend Setup
```bash
cd backend
npm install
# The system fallbacks to SQLite for local development if MySQL is not detected
npm run migrate # Sync database schema
npm run seed    # Populate initial data
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## VPS Deployment (Docker)
Ensure Docker and Docker Compose are installed on your Ubuntu VPS.
```bash
docker-compose up -d --build
```

## Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5000
DB_HOST=localhost
DB_NAME=afera_sms
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your_secret_key
```
