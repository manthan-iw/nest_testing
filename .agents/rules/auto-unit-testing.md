# Automated TDD Unit Testing & Comprehensive Quality Standards

## 🎯 Mandatory Core Rule
Whenever you create, update, or refactor any **Controller**, **Service**, **Guard**, **Middleware**, or **Utility** in this repository:
1. You **MUST FOLLOW TDD (Red-Green-Refactor)**:
   - 🔴 **Write Spec First**: Generate the `*.spec.ts` unit test file defining expected inputs, outputs, and edge cases.
   - 🟢 **Implement Minimal Code**: Write the controller and service code to make tests pass.
   - 🔵 **Refactor & Verify**: Optimize and run `npm test` until 100% of test suites pass.
2. You **MUST ALWAYS** maintain coverage thresholds (>= 75%).
3. You **MUST NEVER** consider a task finished if any unit test is failing or missing.

---

## 📋 Comprehensive 10-Point Testing Checklist (Apply When Applicable)

For every new or modified API/Service, tests must cover:
1. **Happy Path Creation / Write (201 / 200)**: Successful record persistence and sanitization.
2. **Happy Path Retrieval / Read (200)**: Correct response structure and data mapping.
3. **Resource Not Found (404)**: `NotFoundException` when ID is missing or soft-deleted (`deletedAt != null`).
4. **Duplicate / Unique Conflicts (409)**: `ConflictException` when unique fields (email, code, slug) already exist.
5. **Validation & Bad Input (400)**: `BadRequestException` on invalid DTO fields, negative page numbers, or invalid enums.
6. **Unauthorized Access (401)**: `UnauthorizedException` on invalid passwords, bad credentials, or expired JWT.
7. **Forbidden Access / RBAC / Multi-Tenancy (403)**: `ForbiddenException` on insufficient role permissions or tenant ID mismatch.
8. **Database & Unhandled Errors (500)**: Prisma connection or unexpected query failures handled gracefully.
9. **Edge Cases & Data Sanitization**: Sensitive fields (`passwordHash`) stripped, empty arrays returned on no records, soft-delete filters (`deletedAt: null`) strictly enforced.
10. **Pagination, Filtering & Sorting**: Accurate `skip: (page - 1) * limit`, `take: limit`, and `orderBy: { [sortBy]: sortOrder }`.

---

## 🏗️ Testing & Mocking Guidelines (NestJS + Prisma)
- Place `.spec.ts` files alongside their source file (`*.service.spec.ts`, `*.controller.spec.ts`).
- Mock `PrismaService` via in-memory `jest.fn()` functions. Never connect to a live database during unit tests.
- Always call `jest.clearAllMocks()` in `afterEach()`.
- Run `npm test` to verify 100% passing tests before completing any task.
