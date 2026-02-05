# 🌟 Lumina - Express.js TypeScript Boilerplate

A production-grade Express.js starter kit with TypeScript, featuring a fully Object-Oriented architecture, Singleton services, and type-safe database interactions powered by Sequelize ORM. Supports multiple databases including MySQL, PostgreSQL, MariaDB, and SQLite.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [Scripts & Commands](#scripts--commands)
- [Authentication & Security](#authentication--security)
- [File Upload](#file-upload)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Features
- ✅ **TypeScript Support** - Full type safety for the entire codebase
- ✅ **Object-Oriented Architecture** - Clean, maintainable code structure
- ✅ **Singleton Services** - Reusable, globally managed services
- ✅ **Express.js 5.x** - Latest Express framework
- ✅ **Sequelize ORM** - Type-safe database interactions with MySQL support

### Authentication & Security
- 🔐 **JWT Authentication** - Token-based access control
- 🔒 **Password Hashing** - Secure bcrypt implementation
- 🛡️ **Helmet** - HTTP headers security middleware
- ⚡ **Rate Limiting** - Global and auth-specific request rate limits
- 🔑 **CORS** - Cross-Origin Resource Sharing support
- 🛠️ **Maintenance Mode** - Graceful application downtime with bypass capability

### Database Features
- 📊 **Migrations** - Database schema version control with Umzug
- 🌱 **Seeding** - Pre-populate database with sample data
- 🏭 **Factories** - Generate realistic test data with Faker.js
- 📄 **Pagination** - Built-in pagination utility with metadata
- 🔗 **Model Relationships** - Support for Sequelize associations

### Developer Experience
- 📁 **Code Generators** - CLI scripts to scaffold Models, Migrations, Factories, and Controllers
- 📝 **Request Validation** - Zod schema-based validation
- 🌳 **Winston Logging** - Production-ready logging system
- 📦 **File Upload** - Multer integration for file handling
- 🔄 **Hot Reload** - Nodemon for development (**npm run dev**)
- 📊 **Pagination Metadata** - Rich metadata for paginated responses

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Language** | TypeScript (ES2022) |
| **Framework** | Express.js 5.x |
| **ORM** | Sequelize 6.x |
| **Database** | MySQL, PostgreSQL, MariaDB, SQLite |
| **Authentication** | JWT + Bcrypt |
| **Validation** | Zod |
| **Logging** | Winston |
| **File Upload** | Multer |
| **Rate Limiting** | express-rate-limit |
| **Fake Data** | Faker.js |
| **Migrations** | Umzug 3.x |
| **Security** | Helmet |
| **Development** | Nodemon, tsx |

---

## 📁 Project Structure

```
lumina/
├── src/
│   ├── config/
│   │   └── database.ts              # Database configuration
│   ├── controllers/
│   │   ├── AuthController.ts        # Authentication endpoints
│   │   └── UserController.ts        # User CRUD operations
│   ├── models/
│   │   ├── index.ts                 # Database connection & model loader
│   │   └── User.ts                  # User model with attributes
│   ├── services/
│   │   ├── AuthService.ts           # Auth business logic
│   │   ├── UserService.ts           # User business logic
│   │   ├── RouteService.ts          # Route registration
│   │   └── StorageService.ts        # File upload handler
│   ├── middlewares/
│   │   ├── Authentication.ts        # JWT verification
│   │   ├── Validator.ts             # Zod validation
│   │   ├── Limiter.ts               # Rate limiting
│   │   └── Maintenance.ts           # Maintenance mode
│   ├── requests/
│   │   └── UserRequest.ts           # Validation schemas
│   ├── routes/
│   │   ├── api.ts                   # API routes (/api/*)
│   │   └── web.ts                   # Web routes (/*/)
│   ├── database/
│   │   ├── migrations/              # Database schema files
│   │   ├── factories/               # Data factories
│   │   └── seeders/                 # Database seeders
│   ├── exceptions/
│   │   └── Handler.ts               # Global error handling
│   ├── types/
│   │   ├── express/
│   │   │   └── index.d.ts           # Express extensions
│   │   └── Pagination.d.ts          # Pagination types
│   └── utils/
│       ├── ApiResponse.ts           # Standard API responses
│       ├── Hash.ts                  # Password hashing
│       ├── Logger.ts                # Winston logger
│       └── Paginator.ts             # Pagination helper
├── scripts/
│   ├── create-model.ts              # Model generator
│   ├── create-migration.ts          # Migration generator
│   ├── create-controller.ts         # Controller generator
│   ├── create-factory.ts            # Factory generator
│   ├── migrate.ts                   # Migration runner
│   ├── seed.ts                      # Seeder runner
│   ├── maintenance.ts               # Maintenance mode manager
│   └── stubs/                       # Code templates
├── public/
│   ├── uploads/                     # User-uploaded files
│   └── img/                         # Static images
├── views/
│   ├── welcome.html                 # Home page
│   └── maintenance.html             # Maintenance page
├── server.ts                        # Application entry point
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Project dependencies
├── .env                             # Environment variables
├── .gitignore                       # Git ignore rules
└── nodemon.json                     # Nodemon configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (with npm or yarn)
- **Database Server** (MySQL 8.0+, PostgreSQL 12+, MariaDB 10.3+, or SQLite 3.x)
- **Git**

### Installation

#### Option 1: Using the CLI (Recommended)

```bash
# Create a new Lumina project using npm create
npm create lumina-app@latest

# Follow the interactive prompts to set up your project
# Answer the project name question, then:
cd my-lumina-app
npm install
npm run dev
```

#### Option 2: Clone from Repository

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/lumina.git
cd lumina

# 2. Install dependencies
npm install

# 3. Create .env file from template
cp .env.example .env
```

### Configuration

Your project includes a `.env` file template. Use the key generator to create secure secrets, then customize other settings:

#### Step 1: Generate Security Keys

```bash
# Generates random JWT_SECRET and MAINTENANCE_SECRET
npm run key:generate
```

This command:
- Creates `.env` from `.env.example` if it doesn't exist
- Generates a secure 64-character JWT_SECRET
- Generates a secure 64-character MAINTENANCE_SECRET
- Preserves existing configuration values

#### Step 2: Configure Environment Variables

Edit `.env` with your settings:

```env
# Database Configuration
# Supported dialects: mysql, postgres, mariadb, sqlite
DB_DIALECT=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lumina
DB_DATABASE_TEST=lumina_test
DB_USERNAME=root
DB_PASSWORD=your_password
DB_SSL=false

# JWT Configuration
JWT_SECRET=auto_generated_64_char_hex_string  # Generated by key:generate
JWT_EXPIRES_IN=1d                             # Token expiration time

# Application
NODE_ENV=development
APP_PORT=3000

# Logging
LOG_LEVEL=info

# Maintenance Mode
MAINTENANCE_SECRET=auto_generated_64_char_hex_string  # Generated by key:generate
```

**Key Details:**
- `JWT_SECRET`: Used to sign/verify JWT tokens. Change on every deployment for security.
- `MAINTENANCE_SECRET`: Used to bypass maintenance mode. Send as `X-Bypass-Maintenance` header.
- `DB_SSL`: Set to `true` if your database requires SSL connection.
- `NODE_ENV`: Use `production` on live servers to disable SQL logging.

### Quick Start

After installation and configuration, get up and running:

```bash
# 1. Generate security keys (JWT_SECRET, MAINTENANCE_SECRET)
npm run key:generate

# 2. Run migrations to set up the database schema
npm run migrate

# 3. Seed the database with sample data
npm run db:seed

# 4. Start the development server
npm run dev
```

The server will start at `http://localhost:3000` by default (configurable via `APP_PORT` in `.env`)

**Welcome page**: Visit `http://localhost:3000` to see the welcome message
**API Status**: Check `http://localhost:3000/status` for API status

---

## 🗄️ Database Setup

### Creating the Database

**For MySQL/MariaDB:**
```bash
mysql -u root -p
CREATE DATABASE lumina;
EXIT;
```

**For PostgreSQL:**
```bash
psql -U postgres
CREATE DATABASE lumina;
\q
```

**For SQLite:**
```bash
# Database file is created automatically
# Just configure DB_STORAGE path in .env
```

### Running Migrations

```bash
# Run all pending migrations
npm run migrate

# Rollback last migration
npm run migrate:undo

# Reset database (rollback all and re-run)
npm run migrate:reset
```

### Seeding the Database

```bash
# Run all seeders
npm run db:seed
```

This will create:
- 1 admin user: `admin@lumina.com` (password: `lumina123`)
- 20 random users with fake data

---

## 🏗️ Core Concepts

### 1. Singleton Services

Services are instantiated once and reused throughout the application:

```typescript
// src/services/UserService.ts
class UserService {
  public async getAllUsers(page: number, limit: number) {
    return await Paginator.paginate(User, page, limit);
  }
}

export default new UserService(); // Single instance
```

**Usage:**
```typescript
import UserService from '../services/UserService.js';

const users = await UserService.getAllUsers(1, 15);
```

### 2. Controllers (MVC Pattern)

Controllers handle HTTP requests and delegate to services:

```typescript
// src/controllers/UserController.ts
class UserController {
  public async index(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 15;
      const users = await UserService.getAllUsers(page, limit);
      return ApiResponse.success(res, users, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
```

### 3. Models (Sequelize ORM)

Type-safe database models with attributes and associations:

```typescript
// src/models/User.ts
interface UserAttributes {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  avatar: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare firstname: string;
  declare lastname: string;
  declare email: string;
  declare password: string;
  declare role: string;
  declare avatar: string | null;

  static initModel(sequelize: Sequelize) {
    User.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // ... other attributes
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      paranoid: true, // Soft deletes
      timestamps: true,
      underscored: true, // created_at instead of createdAt
    });
  }
}
```

### 4. Middleware Pipeline

Middleware processes requests in order before reaching controllers:

```typescript
// server.ts
app.use(Maintenance.handle);         // Check maintenance mode
app.use(helmet());                   // Security headers
app.use(cors());                     // CORS support
app.use(express.json());             // Parse JSON
app.use(Limiter.global);             // Rate limiting
RouteService.boot(app);              // Load routes
app.use(ExceptionHandler.notFound);  // 404 handler
app.use(ExceptionHandler.handle);    // Error handler
```

### 5. Factories (Data Generation)

Generate realistic test data with Faker.js:

```typescript
// src/database/factories/UserFactory.ts
class UserFactory extends Factory<User> {
  protected model = User;

  protected definition() {
    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      password: '$2b$10$YourHashedPasswordHere',
      role: 'user',
      avatar: null,
    };
  }
}

// Usage in seeders
await UserFactory.createMany(20);
```

### 6. Pagination

Built-in pagination with metadata:

```typescript
const result = await Paginator.paginate(User, 1, 15, {
  attributes: { exclude: ['password'] },
  order: [['id', 'DESC']]
});

// Response structure:
{
  data: [...users],
  meta: {
    total: 100,
    per_page: 15,
    current_page: 1,
    last_page: 7,
    from: 1,
    to: 15
  }
}
```

---

## 📡 API Reference

### Authentication Endpoints

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@lumina.com",
  "password": "lumina123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "firstname": "Admin",
      "lastname": "Lumina",
      "email": "admin@lumina.com",
      "role": "admin",
      "avatar": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```http
GET /api/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstname": "Admin",
    "email": "admin@lumina.com",
    "role": "admin"
  }
}
```

### User Endpoints

#### List Users (Paginated)
```http
GET /api/users?page=1&limit=15
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "data": [
      {
        "id": 1,
        "firstname": "John",
        "lastname": "Doe",
        "email": "john@example.com",
        "role": "user",
        "avatar": null
      }
    ],
    "meta": {
      "total": 21,
      "per_page": 15,
      "current_page": 1,
      "last_page": 2,
      "from": 1,
      "to": 15
    }
  }
}
```

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "firstname": "Jane",
  "lastname": "Smith",
  "email": "jane@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 22,
    "firstname": "Jane",
    "lastname": "Smith",
    "email": "jane@example.com",
    "role": "user",
    "avatar": null
  }
}
```

#### Upload Avatar
```http
POST /api/users/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

avatar: <file>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "path": "uploads/avatar-1640000000000-123456789.jpg",
    "url": "http://localhost:3000/uploads/avatar-1640000000000-123456789.jpg"
  }
}
```

### Web Endpoints

#### Home Page
```http
GET /
```
Returns the welcome HTML page

#### System Status
```http
GET /status
```

**Response (200):**
```json
{
  "status": "UP",
  "environment": "development"
}
```

---

## 🔧 Scripts & Commands

### Development

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Run tests
npm test
```

### Database

```bash
# Run all pending migrations
npm run migrate

# Rollback the last migration
npm run migrate:undo

# Rollback all migrations and re-run them
npm run migrate:reset

# Seed the database
npm run db:seed
```

### Environment & Security

```bash
# Generate secure JWT and Maintenance keys
npm run key:generate
# Updates: .env with random secrets
# Run this after installing or before deployment
```

### Code Generation

```bash
# Generate a new model
npm run create:model ModelName
# Creates: src/models/ModelName.ts

# Generate a new migration
npm run create:migration create_table_name
# Creates: src/database/migrations/TIMESTAMP-create_table_name.js

# Generate a new controller
npm run create:controller UserController
npm run create:controller user  # Auto-appends 'Controller'
# Creates: src/controllers/UserController.ts

# Generate a new factory
npm run create:factory UserFactory
npm run create:factory user  # Auto-appends 'Factory'
# Creates: src/database/factories/UserFactory.ts
```

### Maintenance

```bash
# Put server in maintenance mode
npm run down
# Creates: maintenance.lock

# Bring server back online
npm run up
# Removes: maintenance.lock
```

---

## 🔐 Authentication & Security

### JWT Token Flow

```
1. User submits credentials
   ↓
2. AuthService.login() validates credentials
   ↓
3. JWT token generated with payload: {id, email, role}
   ↓
4. Token sent to client (1 day expiry)
   ↓
5. Client includes token in Authorization header: Bearer <token>
   ↓
6. Authentication middleware verifies token
   ↓
7. User data attached to req.user
```

### Adding JWT Authentication to Routes

```typescript
// src/routes/api.ts
import Authentication from '../middlewares/Authentication.js';

// Protected route
this.router.get('/me', Authentication.handle, AuthController.me);
```

### Password Security

```typescript
// Hash a password
const hashedPassword = await Hash.make('password123');

// Verify password
const isValid = await Hash.check('password123', user.password);
```

### Rate Limiting

**Global Limiter:** 100 requests per 15 minutes
```typescript
Limiter.global // Applied to all routes
```

**Auth Limiter:** 5 attempts per hour
```typescript
// src/routes/api.ts
this.router.post('/login', Limiter.auth, AuthController.login);
```

### Security Headers

Helmet provides protection against common vulnerabilities:

```typescript
app.use(helmet({ crossOriginResourcePolicy: false }));
```

---

## 📤 File Upload

### Handling File Uploads

```typescript
// src/routes/api.ts
this.router.post(
  '/users/avatar',
  Authentication.handle,
  StorageService.uploader.single('avatar'),
  UserController.uploadAvatar
);
```

### Upload Configuration

```typescript
// src/services/StorageService.ts
{
  destination: 'public/uploads',
  maxFileSize: 5MB,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
}
```

### Accessing Uploaded Files

Uploaded files are accessible at:
```
http://localhost:3000/uploads/filename
```

---

## ✅ Validation

### Using Zod Schemas

```typescript
// src/requests/UserRequest.ts
import { z } from 'zod';

class UserRequest {
  public static store = z.object({
    firstname: z.string().min(2, 'First name must be at least 2 characters'),
    lastname: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  });
}
```

### Applying Validation Middleware

```typescript
// src/routes/api.ts
import Validator from '../middlewares/Validator.js';
import UserRequest from '../requests/UserRequest.js';

this.router.post(
  '/users',
  Validator.validate(UserRequest.store),
  UserController.store
);
```

### Validation Error Response

```json
{
  "success": false,
  "message": "Validation Failed",
  "code": 422,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

---

## ⚠️ Error Handling

### Global Error Handler

All errors are caught and formatted consistently:

```typescript
// src/exceptions/Handler.ts
class ExceptionHandler {
  handle(err: any, req: Request, res: Response, next: NextFunction) {
    Logger.error('Exception:', err.stack || err.message);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    return ApiResponse.error(res, message, status);
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "User not found",
  "errors": null
}
```

### Throwing Errors in Services

```typescript
class UserService {
  public async updateAvatar(userId: number, avatarPath: string) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new Error('User not found'); // Caught by global handler
    }
    
    user.avatar = avatarPath;
    return await user.save();
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - No/invalid token |
| 404 | Not Found - Resource doesn't exist |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limited |
| 503 | Service Unavailable - Maintenance mode |
| 500 | Internal Server Error - Server error |

---

## 📚 Best Practices

### 1. Use Services for Business Logic

```typescript
// ✅ GOOD - Logic in service
class UserController {
  public async store(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);
      return ApiResponse.success(res, user, 'User created', 201);
    } catch (error) {
      next(error);
    }
  }
}

// ❌ BAD - Logic in controller
public async store(req: Request, res: Response) {
  const user = await User.create(req.body);
  res.json(user);
}
```

### 2. Always Use Validation

```typescript
// ✅ GOOD - Validated input
this.router.post('/users', Validator.validate(UserRequest.store), UserController.store);

// ❌ BAD - No validation
this.router.post('/users', UserController.store);
```

### 3. Handle Errors Properly

```typescript
// ✅ GOOD - Delegated to error handler
public async index(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await UserService.getAllUsers(1, 15);
    return ApiResponse.success(res, users);
  } catch (error) {
    next(error); // Passed to global handler
  }
}

// ❌ BAD - Manual error handling
public async index(req: Request, res: Response) {
  try {
    const users = await UserService.getAllUsers(1, 15);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 4. Use Pagination for Lists

```typescript
// ✅ GOOD - Paginated response
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 15;
const users = await UserService.getAllUsers(page, limit);

// ❌ BAD - Fetch all records
const users = await User.findAll();
```

### 5. Protect Sensitive Routes

```typescript
// ✅ GOOD - Protected route
this.router.get('/users', Authentication.handle, UserController.index);

// ❌ BAD - Public route
this.router.get('/users', UserController.index);
```

### 6. Log Important Events

```typescript
// ✅ GOOD - Logging
Logger.info('User logged in', { userId: user.id });
Logger.error('Database error', error);

// ❌ BAD - No logging
console.log('Error:', error);
```

### 7. Use Type-Safe Queries

```typescript
// ✅ GOOD - Typed attributes
attributes: { exclude: ['password'] }

// ❌ BAD - String selectors
'SELECT email, firstname FROM users'
```

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: Database Connection Failed

**Cause:** Database server not running or incorrect credentials

**Solution:**
```bash
# Verify database is running
# MySQL/MariaDB
sudo systemctl status mysql  # Linux
brew services list          # macOS
services.msc               # Windows

# PostgreSQL
sudo systemctl status postgresql  # Linux
brew services list               # macOS

# Check .env credentials
DB_DIALECT=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lumina
DB_USERNAME=root
DB_PASSWORD=your_password
```

#### Issue: Migration Already Exists

**Cause:** Running migrations twice

**Solution:**
```bash
# Rollback and re-run
npm run migrate:undo
npm run migrate
```

#### Issue: Can't Upload Files

**Cause:** Missing uploads directory or permission issues

**Solution:**
```bash
# Create uploads directory
mkdir -p public/uploads

# Set correct permissions (if needed)
chmod 755 public/uploads
```

#### Issue: Token Invalid After Login

**Cause:** JWT_SECRET mismatch or token expired

**Solution:**
```bash
# Check JWT_SECRET in .env
JWT_SECRET=your_super_secret_key_here

# Verify token expiry
JWT_EXPIRES_IN=1d

# Generate new token by logging in again
```

#### Issue: Rate Limit (429) Error

**Cause:** Too many requests

**Solution:**
```bash
# Wait 15 minutes for global limit reset
# Wait 1 hour for auth limit reset
# Or bypass: curl -H "X-Bypass-Maintenance: secret_key" http://localhost:3000/api/me
```

#### Issue: Port 3000 Already in Use

**Cause:** Another process using the port

**Solution:**
```bash
# Change port in .env
APP_PORT=3001

# Or kill the existing process
lsof -i :3000  # Find PID
kill -9 <PID>  # Kill process
```

---

## 🚀 Production Deployment

### Building for Production

```bash
# Build TypeScript
npm run build

# Output: dist/ directory with compiled JavaScript
```

### Generating Production Secrets

```bash
# Generate strong, unique secrets for production
npm run key:generate

# This creates cryptographically secure 64-character hex strings for:
# - JWT_SECRET: Keeps tokens secure from tampering
# - MAINTENANCE_SECRET: Protects maintenance bypass endpoint
```

**Important:** Run `key:generate` before deploying to production to ensure unique secrets.

### Environment Variables for Production

```env
NODE_ENV=production
APP_PORT=3000
DB_DIALECT=postgres  # Change based on your database
DB_HOST=prod-db-server.com
DB_PORT=5432
DB_DATABASE=lumina_prod
DB_DATABASE_TEST=lumina_test
DB_USERNAME=prod_user
DB_PASSWORD=strong_database_password
DB_SSL=true
JWT_SECRET=generated_by_key:generate_command  # MUST be unique per deployment
JWT_EXPIRES_IN=7d
LOG_LEVEL=error
MAINTENANCE_SECRET=generated_by_key:generate_command  # MUST be unique
```

### Running in Production

```bash
# Start with Node
node dist/server.js

# Or use PM2 for process management
pm2 start dist/server.js --name "lumina"
pm2 save
pm2 startup
```

---

## 📞 Support

For issues, questions, or contributions:

- **Issues:** Open an issue on GitHub
- **Discussions:** Start a discussion for questions
- **Pull Requests:** Contributions are welcome!

---

## 📄 License

ISC - See LICENSE file for details

---

## 🙏 Acknowledgments

Built with modern technologies:
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://zod.dev/)
- [Faker.js](https://fakerjs.dev/)
- [Winston](https://github.com/winstonjs/winston)

---

**Happy coding! 🚀**
