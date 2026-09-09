# AGENTS.md — Feature-First Engineering Guidelines & Architecture Standards

## 🤖 AI Agent Behavior & Engineering Workflow

### 1. Feature-First Development Workflow
When implementing, modifying, or refactoring API endpoints, Controllers, Services, Guards, Middleware, or Utilities in this repository, follow the **Feature-First / Domain-Driven** approach:

1. 🧱 **Step 1 (Domain Modeling & DTOs):** Define/update Prisma schema, create strong request/response DTOs using `class-validator` and `class-transformer`, and annotate with Swagger `@ApiProperty()`.
2. ⚙️ **Step 2 (Business Logic & Service Layer):** Implement business logic in `*.service.ts`, handling edge cases, entity sanitization (e.g. stripping `passwordHash`), tenant isolation, soft deletes (`deletedAt: null`), and proper NestJS HTTP exceptions.
3. 🌐 **Step 3 (Controller & API Exposure):** Wire up REST route handlers in `*.controller.ts`, define Swagger operation summaries (`@ApiOperation()`, `@ApiResponse()`), and enforce correct HTTP status codes.
4. 🔍 **Step 4 (Verification & Quality Check):** Verify TypeScript compilation (`npm run build`), ensure no linting/runtime errors, and validate functionality via Swagger UI (`/api/v1/docs`).

---

### 2. Comprehensive 10-Point Business & Error Handling Checklist

Ensure all new or modified APIs adhere to the following production standards:

| # | Scenario / Standard | Implementation Requirement |
|---|---|---|
| **1** | **Happy Path Creation / Write** | Return `201 Created` with sanitized response payload (strip sensitive fields like `passwordHash`). |
| **2** | **Happy Path Retrieval / Read** | Return `200 OK` wrapped in global response envelope `{ success: true, statusCode: 200, data, message }`. |
| **3** | **Resource Not Found** | Throw `NotFoundException` (404) when a record does not exist or has `deletedAt !== null`. |
| **4** | **Unique Key / Duplicate Conflict** | Throw `ConflictException` (409) when unique constraint (email, slug, code) is violated. |
| **5** | **Validation & Bad Input** | Enforce DTO validation with `class-validator` (400 `BadRequestException` handled by `ValidationPipe`). |
| **6** | **Authentication & Security** | Enforce JWT guards, bcrypt password hashing (salt rounds = 10), and protect private endpoints. |
| **7** | **Role & Multi-Tenant Access** | Enforce RBAC (`UserRole`) and verify `tenantId` isolation across all entity queries. |
| **8** | **Database & Error Handling** | Let unexpected database errors propagate to `GlobalHttpExceptionFilter` (500 Internal Server Error) without leaking internal DB details. |
| **9** | **Data Sanitization & Soft Deletes** | Enforce `deletedAt: null` on all active queries, trim whitespace, and sanitize passwords. |
| **10** | **Pagination, Filtering & Sorting** | Support pagination parameters (`page`, `limit`), calculate `skip: (page - 1) * limit`, `take: limit`, and support sorting. |

---

## 🛠️ Tech Stack & Conventions
- **Framework:** NestJS (TypeScript)
- **ORM:** Prisma ORM (`@prisma/client`)
- **Database:** PostgreSQL (`go_to_message`)
- **Validation:** `class-validator`, `class-transformer`
- **Logging:** `nestjs-pino` (Structured JSON logging)
- **Documentation:** OpenAPI / Swagger (`@nestjs/swagger`) at `/api/v1/docs`
- **Global Response Envelope:** `{ success: true, statusCode: 200, data: ..., message: string, timestamp: string }`

