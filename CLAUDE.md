# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands

- `npm run start:dev` - Start development server with hot-reload using tsx
- `npm run build` - Compile TypeScript to JavaScript (outputs to `dist/`)
- `npm test` - Run tests using Jest with .env.test configuration
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Database Commands

- `npx prisma migrate deploy` - Run database migrations
- `npx prisma generate` - Generate Prisma client
- `npx prisma studio` - Open Prisma Studio database GUI
- `docker compose up -d postgres` - Start PostgreSQL development database
- `docker compose up -d postgres-test` - Start PostgreSQL test database

## Architecture Overview

This is a Node.js REST API for personal finance management built with a clean architecture pattern:

### Layer Structure

- **Controllers** (`src/controllers/`) - HTTP request handling, validation, response formatting
- **Services** (`src/services/`) - Business logic and use cases
- **Repositories** (`src/repositories/`) - Data persistence layer using Prisma ORM
- **Adapters** (`src/adapters/`) - External service abstractions (password hashing, ID generation)

### Key Patterns

- Factory pattern for dependency injection (see `src/factories/`)
- Standardized HTTP responses using helper functions (`src/controllers/_helpers/http.ts`)
- Comprehensive TypeScript interfaces in `src/shared/types.ts`
- Zod schemas for validation (`src/schemas/`)

### Database

- PostgreSQL with Prisma ORM
- Two main entities: Users and Transactions
- Transaction types: EARNING, EXPENSE, INVESTMENT
- UUID primary keys for all entities

## Testing Strategy

- Tests are co-located with source files (`.test.ts` files)
- Uses Jest with custom configuration for ESM support
- Test fixtures in `src/test/fixtures/` for common test data
- Separate test database using Docker Compose
- Coverage reports generated in `coverage/` directory

## Environment Setup

1. Copy `.env.example` to `.env` and configure:
    - `DATABASE_URL` for main database
    - `PORT` for API server (defaults to 3001)

2. For testing, ensure `.env.test` is configured for test database

## Code Quality Tools

- ESLint with TypeScript support and Jest rules
- Prettier for code formatting
- Husky for pre-commit hooks
- Simple import sorting plugin
- Git commit message linting
