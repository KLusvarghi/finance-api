# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- **Start dev server**: `npm run start:dev` (uses tsx with hot-reload)
- **Build**: `npm run build` (compiles TypeScript to dist/)
- **Tests**: `npm test` (runs with .env.test environment)
- **Test with coverage**: `npm run test:coverage`
- **Watch tests**: `npm run test:watch`

### Database Operations
- **Generate Prisma client**: `npx prisma generate`
- **Run migrations**: `npx prisma migrate deploy`
- **Start local PostgreSQL**: `docker compose up -d postgres`
- **Start test PostgreSQL**: `docker compose up -d postgres-test`

### Code Quality
- **Lint check**: Run ESLint manually via `npx eslint .`
- **Format**: Prettier is configured but run via `npx prettier --write .`

## Architecture Overview

This is a layered REST API following clean architecture principles:

### Layer Structure
1. **Controllers** (`src/controllers/`): HTTP request handling, input validation, response formatting
2. **Services** (`src/services/`): Business logic and use cases
3. **Repositories** (`src/repositories/postgres/`): Data persistence via Prisma
4. **Adapters** (`src/adapters/`): External service abstractions (password hashing, ID generation)

### Key Patterns

**HTTP Response Pattern**: All controllers use standardized response helpers from `src/controllers/_helpers/http.ts`:
- `ok(data)` - 200 success
- `created(data)` - 201 created  
- `badRequest(message, data)` - 400 error
- `notFound(message)` - 404 error
- `serverError(message)` - 500 error

**Validation**: Zod schemas in `src/schemas/` validate all inputs before processing.

**Database**: PostgreSQL with Prisma ORM. All repositories follow the same pattern - one class per entity with CRUD operations.

### Domain Model
- **Users**: Basic user management with bcrypt password hashing
- **Transactions**: Financial transactions linked to users with types (EARNING, EXPENSE, INVESTMENT)
- UUIDs used as primary keys throughout

### Testing Strategy
- Unit tests for services and repositories
- Integration tests for controllers (with test database)
- Fixtures in `src/test/fixtures/` for test data generation
- Uses `@faker-js/faker` for generating test data
- Test database configured via `.env.test` and Docker Compose

### Environment Configuration
- **Development**: `.env` with local database
- **Testing**: `.env.test` with separate test database  
- **Database URL**: PostgreSQL connection string required
- **Port**: API runs on PORT environment variable (default in code varies)

## Important Implementation Details

### Database Schema
- Users have first_name, last_name, email (unique), password (bcrypt hashed)
- Transactions have user_id (FK), name, amount (Decimal), date, type (enum)
- Prisma schema at `prisma/schema.prisma` with migrations in `prisma/migrations/`

### Error Handling
- Controllers catch service errors and return appropriate HTTP responses
- Validation errors from Zod schemas are handled uniformly
- Database constraint violations (like duplicate email) are caught and returned as bad requests

### Code Organization
- Each feature (users, transactions) has parallel structure across all layers
- Index files in each directory export all related functionality
- Test files are co-located with source files using `.test.ts` suffix

### Development Workflow
1. Start database: `docker compose up -d postgres`
2. Run migrations: `npx prisma migrate deploy`  
3. Start dev server: `npm run start:dev`
4. Run tests: `npm test` (automatically uses test database)

### Special Notes
- TypeScript strict mode enabled
- ESM modules used throughout (type: "module" in package.json)
- Husky pre-commit hooks for code quality
- Jest configured for ESM with ts-jest preset
- No authentication implemented yet (marked as roadmap item)