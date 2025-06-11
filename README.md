# MNA Law Nexus

A comprehensive legal practice management system for law firms.

## Features

- User Authentication and Authorization
- Case Management
- Document Management
- Task Management
- Team Collaboration
- Role-based Access Control

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Winston Logger

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Query
- React Router

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JimnaSafari/QEXLE-SYSTEM.git
cd QEXLE-SYSTEM
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mna_law_nexus
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
```

4. Run database migrations:
```bash
npm run migrate
```

5. Start the backend server:
```bash
npm run dev
```

6. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

7. Start the frontend development server:
```bash
npm run dev
```

## API Documentation

### Authentication
- POST /api/auth/login - User login
- POST /api/auth/register - Register new user (Admin only)
- GET /api/auth/profile - Get user profile
- PUT /api/auth/profile - Update user profile
- PUT /api/auth/change-password - Change password

### Cases
- GET /api/cases - Get all cases
- POST /api/cases - Create new case
- GET /api/cases/:id - Get case by ID
- PUT /api/cases/:id - Update case
- DELETE /api/cases/:id - Delete case
- GET /api/cases/stats - Get case statistics

### Documents
- GET /api/documents - Get all documents
- POST /api/documents/upload - Upload document
- GET /api/documents/:id - Get document by ID
- GET /api/documents/:id/download - Download document
- PUT /api/documents/:id - Update document
- DELETE /api/documents/:id - Delete document

### Tasks
- GET /api/tasks - Get all tasks
- POST /api/tasks - Create new task
- GET /api/tasks/:id - Get task by ID
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task
- GET /api/tasks/stats - Get task statistics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 