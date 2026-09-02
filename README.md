# Virtual Exhibition SaaS Platform - Backend API (`Exi_2026`)

Production-grade, modular **NestJS** backend architecture connected to **PostgreSQL** (`go_to_message`) for the **Virtual Exhibition SaaS Platform**.

---

## 📋 Table of Contents
1. [Tech Stack](#-tech-stack)
2. [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
3. [File Explanation Guide](#-file-explanation-guide)
4. [NPM Packages Reference](#-npm-packages-reference)
5. [Environment & Database Configuration](#-environment--database-configuration)
6. [Getting Started & Local Development](#-getting-started--local-development)
7. [Project Context & Activity Tracking](#-project-context--activity-tracking)

---

## 🛠️ Tech Stack
- **Framework**: NestJS (Node.js & TypeScript)
- **Database**: PostgreSQL 16 (`go_to_message`)
- **ORM**: Prisma ORM (`@prisma/client`, `prisma`)
- **Authentication**: JWT & Passport with `bcryptjs` password hashing
- **Validation**: `class-validator` & `class-transformer`
- **Documentation**: OpenAPI / Swagger UI (`/api/v1/docs`)
- **Logging**: Pino High-Performance Structured Logger (`nestjs-pino`, `pino-http`)
- **Containerization**: Docker & Docker Compose

---

## 📁 Project Architecture & Directory Structure

```text
Exi_2026/
├── docker-compose.yml           # Local PostgreSQL 16 & Adminer database containers
├── Dockerfile                   # Multi-stage production container build
├── .env / .env.example          # Environment variables configuration
├── package.json                 # Dependency definitions & scripts
├── tsconfig.json                # TypeScript compiler configuration & path aliases
├── nest-cli.json                # NestJS CLI configuration
├── prisma/                      # Prisma ORM Schema & Migrations
│   └── schema.prisma            # PostgreSQL models (User, enums, relations)
├── logs/                        # Runtime log files
│   ├── app.log                  # System application logs
│   ├── http.log                 # HTTP access audit logs
│   └── error.log                # Stack traces & exception logs
└── src/
    ├── main.ts                  # Application entry point, Swagger, Pipes, CORS
    ├── app.module.ts            # Root module tying Config, DB, and Domain modules
    ├── config/                  # Type-safe dynamic configuration
    │   ├── app.config.ts        # Server port, prefix (api/v1), CORS origin
    │   └── database.config.ts   # PostgreSQL connection options
    ├── common/                  # Cross-cutting concerns & shared utilities
    │   ├── filters/             # Global HTTP Exception Filter
    │   ├── interceptors/        # API Response Transformation Interceptor
    │   ├── logger/              # Pino Structured Logger setup
    │   └── middleware/         # HTTP Request Audit Logging Middleware
    ├── database/                # Database service
    │   ├── prisma.service.ts    # Prisma client lifecycle service
    │   └── prisma.module.ts     # Global Prisma database module
    └── modules/                 # Domain Feature Modules
        ├── auth/                # Authentication & User Login (JWT, bcrypt)
        ├── users/               # Platform User Management (Roles, CRUD)
        ├── tenants/             # SaaS Multi-tenant Organization Management
        ├── exhibitions/         # Virtual Exhibition Events Management
        ├── booths/              # Virtual Booths & Stalls Management
        └── analytics/           # Visitor engagement & interaction analytics
```

---

## 📄 File Explanation Guide

### 🟢 Root Files
- **`src/main.ts`**: The application entry point. Bootstraps NestJS, starts the web server (`app.listen(3000)`), enables CORS, attaches the global validation pipe, and mounts Swagger UI at `/api/v1/docs`.
- **`src/app.module.ts`**: The root NestJS Module. Registers global configuration (`ConfigModule`), PostgreSQL database connection (`PrismaModule`), request logger middleware, and domain feature modules.

### 🟢 Configuration (`src/config/`)
- **`src/config/app.config.ts`**: Manages Web Server settings (`PORT`, `NODE_ENV`, `API_PREFIX`, `CORS_ORIGIN`).
- **`src/config/database.config.ts`**: Manages PostgreSQL connection settings (`host`, `port`, `username`, `password`, `database: 'go_to_message'`).

### 🟢 Shared Utilities (`src/common/`)
- **`src/common/middleware/http-logger.middleware.ts`**: HTTP Middleware that intercepts every incoming request and logs `METHOD`, `ROUTE`, `STATUS`, `LATENCY (ms)`, `IP`, `USER_ID`, and `TENANT_ID` into `logs/http.log`.
- **`src/common/interceptors/transform.interceptor.ts`**: Interceptor that wraps every successful API response into a standard JSON payload (`{ success: true, statusCode: 200, data: ..., message: string }`).
- **`src/common/filters/http-exception.filter.ts`**: Global Error Handler that catches all unhandled exceptions, converts them to uniform error JSON, and logs stack traces to `logs/error.log`.
- **`src/common/logger/logger.service.ts`**: High-performance structured logging service via `nestjs-pino`.

### 🟢 Database Core (`src/database/`)
- **`src/database/prisma.service.ts`**: Prisma Client connection management and lifecycle hooks.
- **`src/database/prisma.module.ts`**: Global NestJS module providing PrismaService across domain modules.

### 🟢 Feature Modules (`src/modules/`)
Each domain module contains:
1. **`*.controller.ts`**: Express-style REST route handlers receiving HTTP requests and invoking services.
2. **`*.service.ts`**: Business logic layer querying PostgreSQL using Prisma Client.
3. **`*.module.ts`**: NestJS metadata container registering controllers and services.
4. **`dto/*.dto.ts`**: Data Transfer Objects defining request validation rules (`class-validator`) and Swagger annotations (`@ApiProperty()`).

---

## 📦 NPM Packages Reference

### 🚀 Production Dependencies (`dependencies`)

| Package | Purpose / Actual Use |
| :--- | :--- |
| **`@nestjs/core`** | Core NestJS framework engine managing Dependency Injection and module lifecycle. |
| **`@nestjs/common`** | Provides NestJS decorators (`@Controller()`, `@Injectable()`, `@Get()`, `@Post()`), HTTP exceptions, and pipe helpers. |
| **`@nestjs/platform-express`** | Under-the-hood HTTP web server adapter integrating Express.js into NestJS. |
| **`@prisma/client`** | Type-safe auto-generated database client for PostgreSQL. |
| **`pg`** | Official PostgreSQL database client driver for Node.js. |
| **`bcryptjs`** | Secure password hashing library using salt (10 rounds) to hash passwords before storing in PostgreSQL. |
| **`class-validator`** | Declarative validation library offering decorators (`@IsEmail()`, `@IsString()`, `@MinLength()`, `@IsEnum()`) for DTOs. |
| **`class-transformer`** | Transforms plain HTTP JSON objects into typed TypeScript DTO class instances. |
| **`@nestjs/swagger`** | OpenAPI engine generating interactive API documentation annotations (`@ApiProperty()`, `@ApiOperation()`). |
| **`swagger-ui-express`** | Renders the interactive Swagger UI web interface at `/api/v1/docs`. |
| **`nestjs-pino`** / **`pino-http`** | High-performance structured JSON logging framework. |
| **`@nestjs/config`** | Manages environment variables and dynamic typed config namespaces (`app.config.ts`, `database.config.ts`). |
| **`dotenv`** | Loads environment variables from the `.env` file into `process.env`. |
| **`@nestjs/jwt`** | Creates and verifies JWT access tokens and refresh tokens for user authentication sessions. |
| **`passport`**, **`@nestjs/passport`**, **`passport-jwt`** | Authentication framework managing JWT strategy and route protection guards. |
| **`reflect-metadata`** | Polyfill enabling TypeScript decorator reflection metadata required by NestJS and Prisma. |
| **`rxjs`** | Reactive Extensions library powering NestJS request/response interceptors and async event streams. |

---

### 🛠️ Development Dependencies (`devDependencies`)

| Package | Purpose / Actual Use |
| :--- | :--- |
| **`typescript`** | The TypeScript compiler (`npx tsc`). |
| **`@nestjs/cli`** | NestJS Command Line Tool (`npm run start:dev`, `nest build`). |
| **`ts-node`** | Runs TypeScript files directly without a manual compilation step. |
| **`tsconfig-paths`** | Resolves custom path shortcuts (`@config/*`, `@common/*`, `@modules/*`) at runtime. |
| **`@types/*`** | Provides TypeScript type definitions for JavaScript libraries (`@types/node`, `@types/express`, `@types/bcryptjs`, `@types/pg`). |

---

## ⚙️ Environment & Database Configuration

Database connection settings in **`.env`**:
```env
PORT=3000
API_PREFIX=api/v1

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1234
POSTGRES_DB=go_to_message
DB_SYNCHRONIZE=true
```

---

## 🚀 Getting Started & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start PostgreSQL Container (Optional)
```bash
docker-compose up -d
```

### 3. Run Development Server
```bash
npm run start:dev
```

### 4. Interactive API Documentation
Open your browser to:
`http://localhost:3000/api/v1/docs`

---

## 📄 Project Context & Activity Tracking
- **`CONTEXT.md`**: Architectural standards, entity relations, and business logic specifications.
- **`LOGS.md`**: Complete audit log of developer and automated system actions.
- **`DAILY_TASK_NOTES.md`**: Sprint progress tracker and milestone checklist.
