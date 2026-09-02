# AGENTS.md — TDD Engineering Guidelines & AI Testing Standards

## 🤖 AI Agent Behavior & TDD Workflow

### 1. Mandatory Test-Driven Development (TDD) Cycle
Whenever implementing, modifying, or refactoring any API endpoint, Controller, Service, Guard, Middleware, or Utility in this repository, you MUST follow the **Red-Green-Refactor** TDD methodology:

1. 🔴 **Step 1 (Red — Spec First):** Write the unit test file `*.spec.ts` **first**, defining the expected inputs, outputs, and edge cases before writing the business logic.
2. 🟢 **Step 2 (Green — Minimal Implementation):** Implement the minimal code in `*.service.ts` and `*.controller.ts` required to make the test pass.
3. 🔵 **Step 3 (Refactor & Verify):** Clean up code, remove redundancy, verify type safety, and execute `npm test` to ensure 100% of tests pass.

---

### 2. Testing & Mocking Rules (NestJS + Prisma)
- **Rule 1 (Mock External Services):** Unit tests must mock `PrismaService` via in-memory `jest.fn()` functions. Do not attempt to connect to a live database during unit tests.
- **Rule 2 (Comprehensive Edge Cases):** Test happy paths (200, 201), exception paths (`NotFoundException`, `ConflictException`, `BadRequestException`, `UnauthorizedException`), soft-delete filters (`where: { deletedAt: null }`), and data sanitization (stripping `passwordHash`).
- **Rule 3 (Autonomous Fixes):** If `npm test` fails during execution, automatically diagnose the failure, fix the issue, and rerun tests before completing the task.
- **Rule 4 (Maintain Coverage Thresholds):** Maintain minimum 75%+ statement, branch, function, and line coverage across all domain modules.

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

## 📁 Testing Pattern Reference (NestJS + Prisma)

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ExampleService } from './example.service';
import { PrismaService } from '../../database/prisma.service';

describe('ExampleService', () => {
  let service: ExampleService;
  let prisma: any;

  beforeEach(async () => {
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```
