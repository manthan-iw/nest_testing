# AGENTS.md — TDD Engineering Guidelines & Comprehensive AI Testing Standards

## 🤖 AI Agent Behavior & TDD Workflow

### 1. Mandatory Test-Driven Development (TDD) Cycle
Whenever implementing, modifying, or refactoring any API endpoint, Controller, Service, Guard, Middleware, or Utility in this repository, you MUST follow the **Red-Green-Refactor** TDD methodology:

1. 🔴 **Step 1 (Red — Spec First):** Write the unit test file `*.spec.ts` **first**, defining the expected inputs, outputs, and edge cases before writing the business logic.
2. 🟢 **Step 2 (Green — Minimal Implementation):** Implement the minimal code in `*.service.ts` and `*.controller.ts` required to make the test pass.
3. 🔵 **Step 3 (Refactor & Verify):** Clean up code, remove redundancy, verify type safety, and execute `npm test` to ensure 100% of tests pass.

---

### 2. Comprehensive 10-Point Testing Matrix (Apply When Applicable)

For every new or modified API/Service, unit test suites must comprehensively cover the following scenarios:

| # | Test Scenario | Expected Behavior / Status | Mocking & Assertion Strategy |
|---|---|---|---|
| **1** | **Happy Path Creation / Write** | **201 Created / 200 OK** | Mock Prisma `create`/`update`, assert correct database payload and stripped sensitive fields. |
| **2** | **Happy Path Retrieval / Read** | **200 OK** | Mock Prisma `findMany`/`findFirst`, verify query response envelope. |
| **3** | **Resource Not Found** | **404 NotFoundException** | Mock Prisma returning `null` or soft-deleted record; assert `NotFoundException` thrown. |
| **4** | **Unique Key / Duplicate Conflict** | **409 ConflictException** | Mock existing record on `findUnique`; assert `ConflictException` thrown. |
| **5** | **Validation / Bad Input** | **400 BadRequestException** | Test invalid email, missing required fields, negative pagination numbers, or invalid enum values. |
| **6** | **Unauthorized Access** | **401 UnauthorizedException** | Test invalid credentials, bad passwords (`bcrypt.compare => false`), missing/expired JWT. |
| **7** | **Forbidden / Role & Tenant Access** | **403 ForbiddenException** | Test insufficient role permissions (e.g. `ATTENDEE` trying to access `SUPER_ADMIN` routes) or tenant ID mismatch. |
| **8** | **Database & Unhandled Errors** | **500 InternalServerError** | Test Prisma connection failures or query crashes; verify Global Exception Filter handles gracefully. |
| **9** | **Edge Cases & Data Sanitization** | **Consistent & Sanitized** | Verify `passwordHash` is never exposed, empty arrays returned when no records exist, trim whitespace, and enforce `deletedAt: null`. |
| **10** | **Pagination, Filtering & Sorting** | **200 OK with Meta** | Verify Prisma called with calculated `skip: (page - 1) * limit`, `take: limit`, `orderBy: { field: 'asc'|'desc' }`, and returns total page metadata. |

---

### 3. Testing & Mocking Rules (NestJS + Prisma)
- **Rule 1 (Mock External Services):** Unit tests must mock `PrismaService` via in-memory `jest.fn()` functions. Do not attempt to connect to a live database during unit tests.
- **Rule 2 (Autonomous Fixes):** If `npm test` fails during execution, automatically diagnose the failure, fix the issue, and rerun tests before completing the task.
- **Rule 3 (Maintain Coverage Thresholds):** Maintain minimum 75%+ statement, branch, function, and line coverage across all domain modules.

---

## 🛠️ Tech Stack & Conventions
- **Framework:** NestJS (TypeScript)
- **ORM:** Prisma ORM (`@prisma/client`)
- **Database:** PostgreSQL (`go_to_message`)
- **Testing:** Jest (`ts-jest`, `@nestjs/testing`, `lint-staged`, `husky`)
- **Validation:** `class-validator`, `class-transformer`
- **Logging:** `nestjs-pino`
- **Global Response Envelope:** `{ success: true, statusCode: 200, data: ..., message: string, timestamp: string }`

---

## 📁 Testing Pattern Reference (Pagination & Error Handling)

```typescript
describe('ExampleService', () => {
  let service: ExampleService;
  let prisma: any;

  beforeEach(async () => {
    const mockPrismaService = {
      item: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExampleService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ExampleService>(ExampleService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Example: Testing Pagination & Filtering
  it('should apply pagination and sorting filters', async () => {
    prisma.item.findMany.mockResolvedValue([]);
    prisma.item.count.mockResolvedValue(0);

    const query = { page: 2, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' };
    await service.findAll(query);

    expect(prisma.item.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null },
      skip: 10,
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  });
});
```
