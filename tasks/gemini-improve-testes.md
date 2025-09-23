---
id: 2025-09-19-improve-tests-suite
titulo: Improve Test Suite Consistency and Robustness
tipo: refactor
---

This document outlines the tasks required to refactor and standardize the test suite based on the provided analysis. The main goals are to improve consistency, remove anti-patterns (manual stubs), and ensure all tests follow the best practices defined in the project rules.

---

### Task 1: Refactor Adapter Tests for SUT Instantiation Consistency

-   **id**: `2025-09-19-refactor-adapter-tests-consistency`
-   **titulo**: `Refactor Adapter Tests for SUT Instantiation Consistency`
-   **tipo**: `refactor`

#### 1. Contexto e Objetivo

The analysis report noted that while adapter tests are generally good, some instantiate the SUT (System Under Test) directly in the `describe` block. To enforce a single, consistent pattern across the entire codebase, all SUTs should be instantiated within a `beforeEach` block. This improves test isolation and predictability, even for stateless adapters.

#### 2. Plano de Execução

-   [ ] Identify all test files in `src/adapters/` where the `sut` is not created inside a `beforeEach` block. A key example is `password-comparator.test.ts`.
-   [ ] For each identified file, move the `sut` instantiation (e.g., `sut = new PasswordComparator();`) into a `beforeEach` block.
-   [ ] Ensure the `sut` variable is declared at the `describe` scope (e.g., `let sut: PasswordComparator;`).

#### 3. Arquivos-Alvo

-   `src/adapters/password-comparator.test.ts`
-   Any other `src/adapters/**/*.test.ts` files that do not follow the pattern.

#### 4. Critérios de Aceite

-   [ ] In all adapter tests, the SUT is instantiated inside a `beforeEach` block.
-   [ ] All tests (`pnpm test`) pass.
-   [ ] The code passes the linter (`pnpm eslint:check`).

#### 5. Diretrizes & Regras

-   **Testes**: Follow the SUT instantiation and isolation patterns defined in `@.cursor/rules/testing.mdc`.
-   **Visão Geral do Projeto**: Refer to `@.cursor/rules/project.mdc` for general project conventions.

---

### Task 2: Standardize Service Tests with `jest-mock-extended`

-   **id**: `2025-09-19-standardize-service-tests`
-   **titulo**: `Standardize Service Tests using jest-mock-extended and SUT pattern`
-   **tipo**: `refactor`

#### 1. Contexto e Objetivo

This is the main improvement identified in the report. Currently, service tests are inconsistent. Some use verbose, manual stubs (e.g., `GetUserByIdRepositoryStub`), while others use `jest-mock-extended`. The goal is to refactor all service tests to use the modern, type-safe approach with `jest-mock-extended` and follow the standard SUT instantiation pattern, making them cleaner, more consistent, and easier to maintain.

#### 2. Plano de Execução

-   [ ] Start with `src/services/users/get-user-by-id.test.ts`.
-   [ ] Remove the manual `GetUserByIdRepositoryStub` class and the `makeSut` factory.
-   [ ] Use `jest-mock-extended` to create a `MockProxy` for the `GetUserByIdRepository` dependency.
-   [ ] Refactor the `describe` block to follow the standard structure:
    -   Declare `sut` and mock dependencies at the top level of the `describe`.
    -   In `beforeEach`, create fresh mocks (`mock<Dependency>()`) and a new `sut` instance with these mocks.
    -   In `afterEach`, call `jest.clearAllMocks()` to ensure test isolation.
-   [ ] Update the individual tests (`it` blocks) to use the new mock structure for arranging and asserting.
-   [ ] Systematically apply the same pattern to **all other test files** under `src/services/`.

#### 3. Arquivos-Alvo

-   `src/services/users/get-user-by-id.test.ts` (priority)
-   All other `src/services/**/*.test.ts` files.

#### 4. Critérios de Aceite

-   [ ] All manual stubs and helper factories (like `makeSut`) within service tests are removed.
-   [ ] All service tests use `mock<Dependency>` from `jest-mock-extended` for their dependencies.
-   [ ] All service tests instantiate the SUT and mocks within a `beforeEach` block.
-   [ ] All service tests have an `afterEach` block with `jest.clearAllMocks()`.
-   [ ] All tests (`pnpm test`) pass.
-   [ ] The code passes type-check (`pnpm ts:check`) and linter (`pnpm eslint:check`).

#### 5. Diretrizes & Regras

-   **Testes**: This task is a direct implementation of the patterns in `@.cursor/rules/testing.mdc`, especially the "Correct (with `beforeEach` for DRY)" example.
-   **Padrões de Código**: Adhere to the DI principles in `@.cursor/rules/project.mdc`.
-   **Referência**: Use the existing controller tests (e.g., `src/controllers/users/delete-user.test.ts`) as a perfect example of the target structure.

---

### Task 3: Ensure Cleanup in Controller Tests

-   **id**: `2025-09-19-ensure-cleanup-controller-tests`
-   **titulo**: `Add jest.clearAllMocks() to Controller Tests for Consistency`
-   **tipo**: `chore`

#### 1. Contexto e Objetivo

The controller tests are already in great shape, but for maximum consistency and to prevent any potential side-effects between tests, it's a best practice to ensure mocks are reset after each test. This task ensures that every controller test file includes this cleanup step.

#### 2. Plano de Execução

-   [ ] Review all test files in `src/controllers/`.
-   [ ] For any file that does not have an `afterEach` block containing `jest.clearAllMocks()`, add one.

#### 3. Arquivos-Alvo

-   All `src/controllers/**/*.test.ts` files.

#### 4. Critérios de Aceite

-   [ ] Every `describe` block in controller tests has an `afterEach(() => { jest.clearAllMocks(); });` block.
-   [ ] All tests (`pnpm test`) pass.

#### 5. Diretrizes & Regras

-   **Testes**: This enforces a core principle from `@.cursor/rules/testing.mdc` regarding test isolation and setup/teardown.
-   **Visão Geral do Projeto**: Refer to `@.cursor/rules/project.mdc` for general project conventions.
