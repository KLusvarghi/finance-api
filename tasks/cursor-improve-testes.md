---
id: 2025-09-19-improve-tests-consistency-and-best-practices
titulo: Refatorar Testes para Alinhar com Melhores Práticas (Happy Path e DRY)
tipo: refactor
---

### 1. Contexto e Objetivo

A suíte de testes atual está funcional, mas apresenta inconsistências e oportunidades de melhoria. Foram identificados problemas como repetição de código (boilerplate), setups de mocks feitos individualmente em cada teste, uso desnecessário de hooks de limpeza (`afterEach`) e testes com múltiplas responsabilidades.

O **objetivo** é refatorar a base de testes para aumentar a manutenibilidade, legibilidade e robustez, aplicando de forma consistente os seguintes padrões:

1.  **Happy Path Pattern**: Centralizar o setup do cenário de sucesso no hook `beforeEach`.
2.  **DRY (Don't Repeat Yourself)**: Eliminar código duplicado, especialmente na configuração de mocks e na criação de dados para testes E2E.
3.  **Single Responsibility Principle (SRP)**: Garantir que cada bloco `it` teste uma única responsabilidade.

### 2. Plano de Execução

- [ ] **Refatorar Testes de Controllers**:
    - Modificar os hooks `beforeEach` para configurar o "happy path" (cenário de sucesso padrão) para os serviços injetados.
    - Remover os hooks `afterEach` que apenas limpam mocks (`jest.clearAllMocks()`), pois `jest-mock-extended` já gerencia isso.
    - Ajustar os testes de casos de erro (`describe('error handling', ...)`), que devem apenas sobrescrever o mock necessário para o cenário de falha específico.
    - Simplificar os testes de sucesso, que devem depender inteiramente do setup feito no `beforeEach`, sem precisar de `arrange` adicional.

- [ ] **Refatorar Testes de Services**:
    - Aplicar o mesmo "Happy Path Pattern" do `beforeEach` para todas as dependências (Repositories, Adapters).
    - Separar claramente os testes de validação de chamadas (ex: `should call repository with correct params`) dos testes de resultado (ex: `should return the correct data on success`). Cada um deve ser um `it` distinto.

- [ ] **Refatorar Testes E2E**:
    - Nos arquivos de teste E2E (ex: `users.e2e.test.ts`), identificar a criação repetida de entidades (ex: `makeUser()`) no início de vários testes.
    - Centralizar a criação dessas entidades usando um `beforeEach` para garantir que cada teste execute com um estado limpo e isolado, mas sem repetir o código da factory.

### 3. Arquivos-Alvo

- `src/controllers/users/create-user.test.ts`
- `src/controllers/users/update-user.test.ts`
- `src/services/users/create-user.test.ts`
- `src/services/users/update-user.test.ts`
- `src/routes/users.e2e.test.ts`
- **Glob**: `src/controllers/**/*.test.ts`
- **Glob**: `src/services/**/*.test.ts`
- **Glob**: `src/routes/**/*.e2e.test.ts`

### 4. Critérios de Aceite

- [ ] O padrão "Happy Path" é consistentemente utilizado nos hooks `beforeEach` em todos os testes de Controller e Service.
- [ ] Hooks `afterEach` redundantes foram removidos.
- [ ] A repetição de código foi reduzida significativamente, especialmente nos setups de teste.
- [ ] Cada bloco `it` tem uma responsabilidade única e focada.
- [ ] Todos os testes continuam passando (`pnpm test`).
- [ ] O código passa no type-check (`pnpm ts:check`).
- [ ] O código passa no linter (`pnpm eslint:check`).
- [ ] **PROIBIDO** introduzir ou manter o tipo `any` no código.

### 5. Diretrizes & Regras

- **Padrões de Testes**: Esta é a regra principal para esta tarefa. Siga **RIGOROSAMENTE** as diretrizes de `testing.mdc`, especialmente as seções sobre o uso de `beforeEach` para o "happy path" e as estratégias de mocking com `jest-mock-extended`.
- **Visão Geral do Projeto**: Consulte `project.mdc` para entender a arquitetura de injeção de dependência e como as camadas (Controllers, Services) se conectam.
- **Construção de Tarefas**: Esta tarefa foi criada seguindo as diretrizes de `build-improve-tasks.mdc`.
