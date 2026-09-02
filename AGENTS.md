# AGENTS.md — AI Engineering Guidelines & Testing Standards

## 🤖 AI Agent Behavior & Workflow

### 1. Mandatory Automated Unit Testing
Whenever implementing, modifying, or refactoring any API endpoint, Controller, Service, Guard, Middleware, or Utility in this repository:
- **Rule 1 (Auto-Generate Specs):** You MUST automatically generate or update the corresponding `*.spec.ts` unit test file in the same directory.
- **Rule 2 (Mock External Services):** Unit tests must mock `PrismaService` via in-memory `jest.fn()` functions. Do not attempt to connect to a live database during unit tests.
- **Rule 3 (Comprehensive Edge Cases):** Test happy paths (200, 201), exception paths (`NotFoundException`, `ConflictException`, `BadRequestException`, `UnauthorizedException`), soft-delete filters (`deletedAt: null`), and data sanitization (stripping `passwordHash`).
- **Rule 4 (Autonomous Execution & Fix):** Execute `npm test` after writing code. If any test fails, automatically diagnose and fix the error before responding to the user.

---

## 🛠️ Tech Stack & Conventions
- **Framework:** NestJS (TypeScript)
- **ORM:** Prisma ORM (`@prisma/client`)
- **Database:** PostgreSQL (`go_to_message`)
- **Testing:** Jest (`ts-jest`, `@nestjs/testing`)
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
