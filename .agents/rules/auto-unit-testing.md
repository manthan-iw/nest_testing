# Automated TDD Unit Testing & Code Quality Standard

## 🎯 Mandatory Core Rule
Whenever you create, update, or refactor any **Controller**, **Service**, **Guard**, **Middleware**, or **Utility** in this repository:
1. You **MUST FOLLOW TDD (Red-Green-Refactor)**:
   - 🔴 **Write Spec First**: Generate the `*.spec.ts` unit test file defining expected inputs, outputs, and edge cases.
   - 🟢 **Implement Minimal Code**: Write the controller and service code to make tests pass.
   - 🔵 **Refactor & Verify**: Optimize and run `npm test` until 100% of test suites pass.
2. You **MUST ALWAYS** maintain coverage thresholds (>= 75%).
3. You **MUST NEVER** consider a task finished if any unit test is failing or missing.

---

## 🏗️ Unit Testing Architecture & Mocking Standards

### 1. File Location & Naming
- Place `.spec.ts` files in the exact same directory as the target file:
  - `src/modules/<feature>/<feature>.service.spec.ts`
  - `src/modules/<feature>/<feature>.controller.spec.ts`

### 2. Service Testing Rules (Mocking Prisma ORM)
- **Do NOT connect to a live database during unit tests.**
- In `beforeEach()`, mock `PrismaService` methods with `jest.fn()`:
  ```typescript
  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  ```
- Use `Test.createTestingModule()` to compile the in-memory testing module.
- Always call `jest.clearAllMocks()` in `afterEach()`.

### 3. Controller Testing Rules
- Mock the injected Service layer.
- Verify that controller route handlers correctly pass request parameters (`@Body()`, `@Param()`, `@Query()`, `@Req()`) to the corresponding service method.

### 4. Required Test Coverage Matrix for Every API / Service
For each method implemented, the test file must cover:
1. **Happy Path**: Successful creation (201), retrieval (200), update (200), or soft-deletion (200).
2. **Error / Exception Paths**:
   - Duplicate key conflicts ➔ verify `ConflictException` (409) is thrown.
   - Resource not found / soft-deleted ➔ verify `NotFoundException` (404) is thrown.
   - Unauthorized / Invalid credentials ➔ verify `UnauthorizedException` (401) is thrown.
   - Bad inputs / validation failure ➔ verify `BadRequestException` (400) is thrown.
3. **Data Sanitization**: Verify that sensitive fields (e.g., `passwordHash`) are completely stripped from responses.
4. **Soft-Delete Integrity**: Verify that query filters explicitly enforce `deletedAt: null`.
