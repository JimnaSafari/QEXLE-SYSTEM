# MNA Law Nexus Backend

Backend API for the MNA Law Nexus - Law Firm Management System.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- PDFKit for invoice generation

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd mna-law-nexus/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mna_law_nexus
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Email Configuration (if needed)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880 # 5MB in bytes

# Logging
LOG_LEVEL=info
```

4. Create the database:
```bash
createdb mna_law_nexus
```

5. Run migrations:
```bash
npm run migrate
```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Documentation

### Authentication

#### Register Team Member
- **POST** `/api/auth/register`
- **Access**: Private (Admin only)
- **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "attorney",
    "department": "Corporate Law",
    "phone": "+1234567890"
  }
  ```

#### Login
- **POST** `/api/auth/login`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Get Current User
- **GET** `/api/auth/me`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`

### Team Management

#### Get All Team Members
- **GET** `/api/team`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`

#### Get Team Member by ID
- **GET** `/api/team/:id`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`

#### Update Team Member
- **PUT** `/api/team/:id`
- **Access**: Private
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Team member fields to update

#### Delete Team Member
- **DELETE** `/api/team/:id`
- **Access**: Private (Admin only)
- **Headers**: `Authorization: Bearer <token>`

## Testing

Run tests:
```bash
npm test
```

## Error Handling

The API uses a consistent error response format:
```json
{
  "success": false,
  "error": {
    "message": "Error message here"
  }
}
```

## Security

- JWT authentication for protected routes
- Password hashing using bcrypt
- Input validation and sanitization
- CORS enabled
- Helmet for security headers
- Rate limiting (if needed)

## Logging

Logs are stored in the `logs` directory:
- `error.log`: Error logs
- `combined.log`: All logs

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

[Your License Here] 