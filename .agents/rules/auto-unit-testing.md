# Feature-First Architecture & Engineering Standards

## 🎯 Core Engineering Guidelines
Whenever you create, update, or refactor any **Controller**, **Service**, **Guard**, **Middleware**, or **Utility** in this repository:
1. **Feature-First Development**:
   - 🧱 **DTOs & Validation**: Create request/response DTOs using `class-validator` and `class-transformer`.
   - ⚙️ **Service Business Logic**: Implement clean business logic with Prisma ORM, handling tenant isolation, error handling, and sensitive field sanitization.
   - 🌐 **Controller & Swagger**: Annotate REST endpoints with Swagger OpenAPI decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`).
2. **Robust Error Handling**:
   - Use standard NestJS HTTP exceptions (`NotFoundException`, `ConflictException`, `BadRequestException`, `ForbiddenException`).
   - Allow unhandled errors to be caught gracefully by `GlobalHttpExceptionFilter`.
3. **Data Sanitization & Soft Deletes**:
   - Always sanitize output (e.g. never return `passwordHash`).
   - Enforce `deletedAt: null` across queries.
4. **Code Quality & Build Verification**:
   - Ensure clean TypeScript typing without any compilation errors (`npm run build`).

---

## 📋 Comprehensive 10-Point Quality Checklist

For every API/Service implementation:
1. **Happy Path Creation / Write (201 / 200)**: Successful record persistence and sanitization.
2. **Happy Path Retrieval / Read (200)**: Correct response structure wrapped in the global response envelope.
3. **Resource Not Found (404)**: `NotFoundException` when ID is missing or soft-deleted (`deletedAt != null`).
4. **Duplicate / Unique Conflicts (409)**: `ConflictException` when unique fields (email, code, slug) already exist.
5. **Validation & Bad Input (400)**: `BadRequestException` on invalid DTO fields, negative page numbers, or invalid enums.
6. **Authentication & Security**: Bcrypt password hashing (salt rounds = 10) and JWT route protection.
7. **Role & Multi-Tenant Access (403)**: `ForbiddenException` on insufficient role permissions or tenant ID mismatch.
8. **Database & Unhandled Errors (500)**: Graceful handling without exposing database internals.
9. **Edge Cases & Data Sanitization**: Sensitive fields stripped, empty arrays returned on no records, soft deletes strictly enforced.
10. **Pagination, Filtering & Sorting**: Accurate calculation of `skip: (page - 1) * limit`, `take: limit`, and support for dynamic sorting.

