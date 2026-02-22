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
- [Testing](#testing)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

<a id="features"></a>

## ✨ Features

### Core Features
- ✅ **TypeScript Support** - Full type safety for the entire codebase
- ✅ **Object-Oriented Architecture** - Clean, maintainable code structure
- ✅ **Singleton Services** - Reusable, globally managed services
- ✅ **Express.js 5.x** - Latest Express framework
- ✅ **Sequelize ORM** - Type-safe database interactions with MySQL support

### Authentication & Security
- 🔐 **JWT Authentication** - Short-lived access tokens (15m) + long-lived refresh tokens (7d)
- 🔒 **Password Hashing** - Secure bcrypt implementation
- 🛡️ **Helmet** - HTTP headers security middleware
- ⚡ **Rate Limiting** - Global and auth-specific request rate limits
- 🔑 **CORS** - Configurable origin restriction via `CORS_ORIGIN` env var
- 🛠️ **Maintenance Mode** - Graceful application downtime with bypass capability
- 🛡️ **CSRF Protection** - Double-submit cookie pattern for web routes
- 🍪 **Secure Cookies** - `httpOnly`, `secure`, and `sameSite` cookie configuration
- 📦 **Body Size Limits** - 10kb request body limits to prevent payload DoS
- 🔐 **Environment Validation** - Zod-powered startup validation of all required env vars
- 🔄 **Graceful Shutdown** - Clean SIGTERM/SIGINT handling with DB connection cleanup

### Database Features
- 📊 **Migrations** - Database schema version control with Umzug
- 🌱 **Seeding** - Pre-populate database with sample data
- 🏭 **Factories** - Generate realistic test data with Faker.js
- 📄 **Pagination** - Built-in pagination utility with metadata
- 🔗 **Model Relationships** - Support for Sequelize associations

### Developer Experience
- 📁 **Code Generators** - CLI scripts to scaffold Models, Migrations, Factories, and Controllers
- 📝 **Request Validation** - Zod schema-based validation
- 🌳 **Winston Logging** - Production-ready logging system with HTTP request logging
- 📦 **File Upload** - Multer integration with MIME type + extension validation
- 🔄 **Hot Reload** - Nodemon for development (**npm run dev**)
- 📊 **Pagination Metadata** - Rich metadata for paginated responses
- 🧪 **Testing** - Vitest test framework with initial test suite
- 🗜️ **Compression** - Gzip response compression for better performance
- 🏥 **Health Check** - Container-ready `/health` endpoint with DB ping
- 🎨 **Styled Views** - Beautiful dark-themed welcome, status, maintenance, and 404 pages

---

<a id="tech-stack"></a>

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Language** | TypeScript (ES2022) |
| **Framework** | Express.js 5.x |
| **ORM** | Sequelize 6.x |
| **Database** | MySQL, PostgreSQL, MariaDB, SQLite |
| **Authentication** | JWT (access + refresh tokens) + Bcrypt |
| **Validation** | Zod |
| **Testing** | Vitest |
| **Logging** | Winston |
| **File Upload** | Multer |
| **Rate Limiting** | express-rate-limit |
| **Compression** | compression |
| **Fake Data** | Faker.js |
| **Migrations** | Umzug 3.x |
| **Security** | Helmet, CSRF, CORS |
| **Development** | Nodemon, tsx |

---

<a id="project-structure"></a>

## 📁 Project Structure

```
lumina/
├── src/
│   ├── config/
│   │   ├── database.ts              # Database configuration
│   │   └── env.ts                   # Centralized environment validation (Zod)
│   ├── controllers/
│   │   ├── AuthController.ts        # Authentication endpoints (login/refresh/logout)
│   │   └── UserController.ts        # User CRUD operations
│   ├── models/
│   │   ├── index.ts                 # Database connection & model loader
│   │   ├── User.ts                  # User model with attributes
│   │   └── RefreshToken.ts          # Refresh token model
│   ├── services/
│   │   ├── AuthService.ts           # Auth business logic (access + refresh tokens)
│   │   ├── UserService.ts           # User business logic
│   │   ├── RouteService.ts          # Route registration
│   │   └── StorageService.ts        # File upload handler (hardened)
│   ├── middlewares/
│   │   ├── Authentication.ts        # JWT verification
│   │   ├── Csrf.ts                  # CSRF protection (double-submit cookie)
│   │   ├── RequestLogger.ts         # HTTP request logging
│   │   ├── Validator.ts             # Zod validation
│   │   ├── Limiter.ts               # Rate limiting
│   │   └── Maintenance.ts           # Maintenance mode
│   ├── requests/
│   │   └── UserRequest.ts           # Validation schemas
│   ├── routes/
│   │   ├── api.ts                   # API routes (/api/*)
│   │   └── web.ts                   # Web routes (/, /status, /health)
│   ├── database/
│   │   ├── migrations/              # Database schema files
│   │   ├── factories/               # Data factories
│   │   └── seeders/                 # Database seeders
│   ├── exceptions/
│   │   └── Handler.ts               # Global error handling (JSON + HTML 404)
│   ├── tests/
│   │   ├── hash.test.ts             # Hash utility tests
│   │   ├── apiResponse.test.ts      # API response tests
│   │   └── env.test.ts              # Environment validation tests
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
│   ├── js/                          # Client-side scripts
│   └── img/                         # Static images
├── views/
│   ├── welcome.html                 # Home page
│   ├── status.html                  # System status dashboard
│   ├── maintenance.html             # Maintenance page
│   └── 404.html                     # Page not found
├── server.ts                        # Application entry point
├── vitest.config.ts                 # Vitest test configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Project dependencies
├── .env                             # Environment variables
├── .gitignore                       # Git ignore rules
└── nodemon.json                     # Nodemon configuration
```

---

<a id="getting-started"></a>

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (with npm or yarn)
- **Database Server** (MySQL 8.0+, PostgreSQL 12+, MariaDB 10.3+, or SQLite 3.x)
- **Git**

### Installation

#### Option 1: Using the CLI (Recommended)

```bash
# Create a new Lumina project using npm create
npm create lumina-project@latest

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

<a id="configuration"></a>

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
JWT_SECRET=auto_generated_64_char_hex_string  # Generated by key:generate (min 16 chars)
JWT_EXPIRES_IN=15m                            # Access token expiry (short-lived)
JWT_REFRESH_EXPIRES_IN=7d                     # Refresh token expiry (long-lived)

# Application
NODE_ENV=development
APP_PORT=3000
CORS_ORIGIN=http://localhost:3000             # Allowed CORS origin

# Logging
LOG_LEVEL=info

# Maintenance Mode
MAINTENANCE_SECRET=auto_generated_64_char_hex_string  # Generated by key:generate
```

**Key Details:**
- `JWT_SECRET`: Used to sign/verify JWT tokens. **Must be at least 16 characters.** The app will fail to start if this is missing or too short.
- `JWT_EXPIRES_IN`: Access token lifetime (e.g., `15m`, `1h`, `1d`).
- `JWT_REFRESH_EXPIRES_IN`: Refresh token lifetime (e.g., `7d`, `30d`).
- `CORS_ORIGIN`: Restricts which origins can make cross-origin requests. Set to your frontend URL in production.
- `MAINTENANCE_SECRET`: Used to bypass maintenance mode. Send as `X-Bypass-Maintenance` header.
- `DB_SSL`: Set to `true` if your database requires SSL connection.
- `NODE_ENV`: Use `production` on live servers to disable SQL logging and console output.

> **⚠️ Startup Validation:** All required environment variables are validated at startup using Zod. The app will fail fast with descriptive error messages if any required variables are missing or invalid.

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

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Welcome page |
| `http://localhost:3000/status` | System status dashboard |
| `http://localhost:3000/health` | Health check (JSON) |

---

<a id="database-setup"></a>

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

<a id="core-concepts"></a>

## 🏗️ Core Concepts

### 1. Centralized Environment Configuration

All environment variables are validated once at startup using Zod and exported as a typed object:

```typescript
// src/config/env.ts
import env from '../config/env.js';

env.JWT_SECRET;    // string (guaranteed 16+ chars)
env.APP_PORT;      // number (default: 3000)
env.NODE_ENV;      // 'development' | 'test' | 'production'
env.CORS_ORIGIN;   // string (default: 'http://localhost:3000')
```

This eliminates scattered `dotenv.config()` calls and ensures type safety throughout the codebase.

### 2. Singleton Services

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

### 3. Controllers (MVC Pattern)

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

### 4. Models (Sequelize ORM)

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
  // ...

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

### 5. Middleware Pipeline

Middleware processes requests in order before reaching controllers:

```typescript
// server.ts
app.use(Maintenance.handle);         // Check maintenance mode
app.use(helmet());                   // Security headers
app.use(cors({ origin: env.CORS_ORIGIN })); // Restricted CORS
app.use(compression());             // Gzip compression
app.use(cookieParser());            // Cookie parsing
app.use(express.json({ limit: '10kb' }));  // Parse JSON (size limited)
app.use(Limiter.global);            // Rate limiting
app.use(RequestLogger.handle);      // HTTP request logging
RouteService.boot(app);             // Load routes
app.use(ExceptionHandler.notFound); // 404 handler (HTML + JSON)
app.use(ExceptionHandler.handle);   // Error handler
```

### 6. Factories (Data Generation)

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

### 7. Pagination

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

<a id="api-reference"></a>

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

**Response (200):**
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
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "a1b2c3d4e5f6..."
  }
}
```

#### Refresh Token
```http
POST /api/refresh
Content-Type: application/json

{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Logout (Revoke Refresh Token)
```http
POST /api/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
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

### Web & Health Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Welcome page (HTML) |
| `GET` | `/status` | System status dashboard (HTML) |
| `GET` | `/status/json` | Live system status data (JSON) |
| `GET` | `/health` | Container health check with DB ping |

#### Health Check
```http
GET /health
```

**Response (200):**
```json
{
  "status": "healthy",
  "uptime": 1234.56,
  "database": "connected",
  "timestamp": "2026-02-22T15:29:08.572Z"
}
```

**Response (503) — Database down:**
```json
{
  "status": "unhealthy",
  "uptime": 1234.56,
  "database": "disconnected",
  "timestamp": "2026-02-22T15:29:08.572Z"
}
```

---

<a id="scripts--commands"></a>

## 🔧 Scripts & Commands

### Development

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Run test suite
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

<a id="authentication--security"></a>

## 🔐 Authentication & Security

### JWT Token Flow (Access + Refresh)

```
1. User submits credentials → POST /api/login
   ↓
2. AuthService validates credentials against database
   ↓
3. Access token (15m) + Refresh token (7d) generated
   ↓
4. Client stores both tokens
   ↓
5. Client sends access token: Authorization: Bearer <token>
   ↓
6. When access token expires → POST /api/refresh with refreshToken
   ↓
7. New access token issued (refresh token stays valid)
   ↓
8. On logout → POST /api/logout revokes refresh token
```

### Adding JWT Authentication to Routes

```typescript
// src/routes/api.ts
import Authentication from '../middlewares/Authentication.js';

// Protected route
this.router.get('/me', Authentication.handle, AuthController.me);
```

### CSRF Protection

Web routes are protected from Cross-Site Request Forgery using a **double-submit cookie pattern**:

```
1. Browser makes GET request → Server sets csrf_token cookie
2. Client-side JS reads csrf_token cookie
3. On POST/PUT/DELETE → Client sends cookie value in x-csrf-token header
4. Server validates header matches cookie
```

> **Note:** API routes using Bearer token authentication are inherently CSRF-safe and don't need this protection.

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

### Security Headers & Middleware

```typescript
app.use(helmet({ crossOriginResourcePolicy: false }));  // Security headers
app.use(cors({ origin: env.CORS_ORIGIN }));              // Restricted CORS
app.use(compression());                                  // Response compression
app.use(cookieParser());                                 // Cookie parsing
app.use(express.json({ limit: '10kb' }));                // Body size limit
```

### Graceful Shutdown

The server handles `SIGTERM` and `SIGINT` signals for clean shutdown:

```typescript
// server.ts
// 1. Stops accepting new connections
// 2. Waits for in-flight requests to complete
// 3. Closes database connection
// 4. Exits cleanly (forced after 10s timeout)
```

---

<a id="file-upload"></a>

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
  maxFiles: 1,
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}
```

**Security features:**
- MIME type validation (images only)
- File extension must match MIME type (prevents spoofing)
- Filename sanitization (strips path traversal characters)
- 5MB file size limit
- Single file per request

### Accessing Uploaded Files

Uploaded files are accessible at:
```
http://localhost:3000/uploads/filename
```

---

<a id="validation"></a>

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

<a id="error-handling"></a>

## ⚠️ Error Handling

### Global Error Handler

All errors are caught and formatted consistently:

```typescript
// src/exceptions/Handler.ts
class ExceptionHandler {
  // Serves styled 404.html for browser requests, JSON for API requests
  notFound(req, res, next) { ... }

  // Logs errors and returns standardized responses
  // Includes error details in development, omits in production
  handle(err, req, res, next) { ... }
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

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - No/invalid token |
| 403 | Forbidden - CSRF validation failed |
| 404 | Not Found - Resource doesn't exist (styled HTML or JSON) |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limited |
| 503 | Service Unavailable - Maintenance mode |
| 500 | Internal Server Error - Server error |

---

<a id="testing"></a>

## 🧪 Testing

### Test Framework

Lumina uses [Vitest](https://vitest.dev/) as its test framework:

```bash
# Run all tests
npm test

# Run tests in watch mode
npx vitest

# Run a specific test file
npx vitest src/tests/hash.test.ts
```

### Included Tests

| Test File | What it Tests |
|-----------|---------------|
| `hash.test.ts` | Password hashing, verification, salt uniqueness |
| `apiResponse.test.ts` | Success/error response formatting |
| `env.test.ts` | Environment validation schema, defaults, required vars |

### Writing New Tests

```typescript
// src/tests/example.test.ts
import { describe, it, expect } from 'vitest';

describe('MyFeature', () => {
  it('should do something', () => {
    expect(1 + 1).toBe(2);
  });
});
```

---

<a id="best-practices"></a>

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

### 4. Use Centralized Environment Config

```typescript
// ✅ GOOD - Typed, validated env
import env from '../config/env.js';
const secret = env.JWT_SECRET;

// ❌ BAD - Raw process.env
import dotenv from 'dotenv';
dotenv.config();
const secret = process.env.JWT_SECRET || 'default_secret';
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

<a id="troubleshooting"></a>

## 🐛 Troubleshooting

### Common Issues

#### Issue: App Fails to Start — Environment Validation Error

**Cause:** Missing or invalid environment variables

**Solution:**
```bash
# Check the error output for which variables are missing
# ❌ Invalid environment variables:
#    JWT_SECRET: JWT_SECRET must be at least 16 characters

# Fix: Generate secure keys
npm run key:generate

# Or manually set required vars in .env
```

#### Issue: Database Connection Failed

**Cause:** Database server not running or incorrect credentials

**Solution:**
```bash
# Verify database is running
# MySQL/MariaDB
sudo systemctl status mysql  # Linux
brew services list          # macOS
services.msc               # Windows

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

**Cause:** Invalid file type or permission issues

**Solution:**
```bash
# Check allowed file types: JPEG, PNG, GIF, WebP only
# Check file size: max 5MB
# Ensure the extension matches the actual file type

# Create uploads directory if missing
mkdir -p public/uploads
```

#### Issue: Token Invalid After Login

**Cause:** JWT_SECRET mismatch or token expired

**Solution:**
```bash
# Access tokens now expire after 15 minutes by default
# Use the refresh token endpoint to get a new access token:
# POST /api/refresh { "refreshToken": "..." }

# Check JWT_SECRET in .env (must be at least 16 characters)
# Generate new token by logging in again
```

#### Issue: CSRF Token Validation Failed (403)

**Cause:** Missing or mismatched CSRF token

**Solution:**
```bash
# For web routes making POST/PUT/DELETE:
# 1. Read the csrf_token cookie value
# 2. Include it in the x-csrf-token header
# API routes using Bearer tokens don't need CSRF tokens
```

#### Issue: Rate Limit (429) Error

**Cause:** Too many requests

**Solution:**
```bash
# Wait 15 minutes for global limit reset
# Wait 1 hour for auth limit reset
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
CORS_ORIGIN=https://yourdomain.com
DB_DIALECT=postgres
DB_HOST=prod-db-server.com
DB_PORT=5432
DB_DATABASE=lumina_prod
DB_USERNAME=prod_user
DB_PASSWORD=strong_database_password
DB_SSL=true
JWT_SECRET=generated_by_key:generate_command
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
LOG_LEVEL=error
MAINTENANCE_SECRET=generated_by_key:generate_command
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

### Health Monitoring

Use the `/health` endpoint for container orchestration (Docker, Kubernetes):

```yaml
# Kubernetes liveness probe example
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 30
```

---

## 📞 Support

For issues, questions, or contributions:

- **Issues:** Open an issue on GitHub
- **Discussions:** Start a discussion for questions
- **Pull Requests:** Contributions are welcome!

---

## 📄 License

This project is licensed under the **MIT License** - a permissive open-source license that allows you to:

- ✅ **Use commercially** - Use the software for commercial purposes
- ✅ **Modify freely** - Modify the source code as needed
- ✅ **Distribute** - Distribute the software and modifications
- ✅ **Private use** - Use privately with no restrictions

### Conditions

The only requirements are:

- 📋 **Include License & Copyright** - Include a copy of the MIT License and copyright notice in your project
- 📝 **Provide License Text** - Make the LICENSE file available in your distribution

### Copyright

Copyright (c) 2026 Glenson Ansin

For the full license text, see the [LICENSE](./LICENSE) file in this repository.

---

## 🙏 Acknowledgments

Built with modern technologies:
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/)
- [Zod](https://zod.dev/)
- [Faker.js](https://fakerjs.dev/)
- [Winston](https://github.com/winstonjs/winston)

---

**Happy coding! 🚀**
