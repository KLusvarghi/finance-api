---
id: 2025-09-23-improve-tests-consistency-and-best-practices
titulo: Refatorar Testes para Alinhar com Melhores Práticas (Happy Path e DRY)
tipo: refactor
---

### 1. Contexto e Objetivo

A suíte de testes atual está funcional, mas apresenta inconsistências significativas e oportunidades de melhoria identificadas através de análise detalhada dos arquivos de teste. Os principais problemas encontrados são:

1. **Repetição de código (boilerplate)**: Configuração de mocks duplicada em cada teste individual
2. **Hooks `afterEach` desnecessários**: Uso de `jest.clearAllMocks()` quando `jest-mock-extended` já gerencia isso automaticamente
3. **Testes com múltiplas responsabilidades**: Um único `it` testando tanto validação de chamadas quanto resultado
4. **Setup inconsistente**: Alguns testes dependem totalmente do `arrange` individual ao invés de centralizar o "happy path" no `beforeEach`
5. **Repetição em testes E2E**: Criação de entidades (`makeUser()`) repetida em cada teste ao invés de centralizar

O **objetivo** é refatorar toda a base de testes para aumentar significativamente a manutenibilidade, legibilidade e robustez, aplicando consistentemente os seguintes padrões:

1. **Happy Path Pattern**: Centralizar o setup do cenário de sucesso no hook `beforeEach`
2. **DRY (Don't Repeat Yourself)**: Eliminar código duplicado em configuração de mocks e criação de dados
3. **Single Responsibility Principle (SRP)**: Garantir que cada bloco `it` teste uma única responsabilidade
4. **Consistent Mock Management**: Remover hooks de limpeza redundantes

### 2. Plano de Execução

- [ ] **Refatorar Testes de Controllers (11 arquivos)**:
    - Modificar todos os hooks `beforeEach` para configurar o "happy path" padrão dos serviços injetados
    - Remover completamente os hooks `afterEach` que fazem `jest.clearAllMocks()` e `jest.restoreAllMocks()`
    - Reestruturar testes de erro para apenas sobrescrever o mock específico necessário
    - Simplificar testes de sucesso para depender totalmente do setup do `beforeEach`
    - Separar testes de validação de chamadas dos testes de resultado quando aplicável

- [ ] **Refatorar Testes de Services (11 arquivos)**:
    - Implementar "Happy Path Pattern" no `beforeEach` para todas as dependências (Repositories, Adapters)
    - Remover hooks `afterEach` redundantes (`jest.clearAllMocks`, `jest.restoreAllMocks`, `jest.resetAllMocks`)
    - Dividir testes que validam múltiplas responsabilidades em `it` separados e focados
    - Centralizar configuração de mocks de sucesso para reduzir duplicação
    - Garantir que testes de erro apenas sobrescrevam mocks específicos

- [ ] **Refatorar Testes E2E (3 arquivos)**:
    - Analisar padrões de criação repetida de entidades como `makeUser()` e `makeUserBalance()`
    - Implementar `beforeEach` centralizado onde aplicável, mantendo isolamento entre testes
    - Reduzir duplicação de setup mantendo clareza e independência dos testes
    - Garantir que cada teste E2E continue executando com estado limpo e isolado

- [ ] **Validação e Execução de Testes**:
    - Executar suite completa de testes após cada refatoração para garantir funcionalidade
    - Verificar que all testes passam com `npm test`
    - Validar consistência dos padrões aplicados em todos os arquivos

### 3. Arquivos-Alvo

#### Controllers (11 arquivos)
- `src/controllers/auth/authenticate-user.test.ts`
- `src/controllers/auth/refresh-token.test.ts`
- `src/controllers/users/create-user.test.ts`
- `src/controllers/users/delete-user.test.ts`
- `src/controllers/users/get-user-by-id.test.ts`
- `src/controllers/users/get-user-balance.test.ts`
- `src/controllers/users/update-user.test.ts`
- `src/controllers/transactions/create-transaction.test.ts`
- `src/controllers/transactions/delete-transaction.test.ts`
- `src/controllers/transactions/get-transactions-by-user-id.test.ts`
- `src/controllers/transactions/update-transaction.test.ts`

#### Services (11 arquivos)
- `src/services/auth/authenticate-user.test.ts`
- `src/services/auth/refresh-token.test.ts`
- `src/services/users/create-user.test.ts`
- `src/services/users/delete-user.test.ts`
- `src/services/users/get-user-balance.test.ts`
- `src/services/users/get-user-by-id.test.ts`
- `src/services/users/update-user.test.ts`
- `src/services/transactions/create-transaction.test.ts`
- `src/services/transactions/delete-transaction.test.ts`
- `src/services/transactions/get-transactions-by-user-id.test.ts`
- `src/services/transactions/update-transaction.test.ts`

#### E2E (3 arquivos)
- `src/routes/auth.e2e.test.ts`
- `src/routes/users.e2e.test.ts`
- `src/routes/transactions.e2e.test.ts`

#### Padrões Globais
- **Glob**: `src/controllers/**/*.test.ts`
- **Glob**: `src/services/**/*.test.ts`
- **Glob**: `src/routes/**/*.e2e.test.ts`

### 4. Critérios de Aceite

- [ ] **Happy Path Pattern**: Implementado consistentemente em todos os `beforeEach` de Controllers e Services
- [ ] **Hooks Limpos**: Todos os hooks `afterEach` redundantes removidos (que fazem apenas limpeza de mocks)
- [ ] **DRY**: Redução significativa de código duplicado, especialmente em setups de teste
- [ ] **SRP**: Cada bloco `it` tem uma responsabilidade única e bem definida
- [ ] **Separação de Responsabilidades**: Testes de validação de chamadas separados de testes de resultado
- [ ] **Consistência**: Mesmo padrão aplicado em todos os 25 arquivos de teste
- [ ] **Funcionalidade**: Todos os testes continuam passando (`npm test`)
- [ ] **Qualidade de Código**: Passa no type-check (`npm run build`)
- [ ] **Linting**: Código está formatado corretamente e segue padrões do projeto
- [ ] **PROIBIDO**: Não introduzir ou manter o tipo `any` no código

### 5. Diretrizes & Regras

- **Padrões de Testes**: Siga **RIGOROSAMENTE** as diretrizes de `testing.mdc`, especialmente:
  - Uso de `beforeEach` para configurar "happy path" padrão
  - Estratégias de mocking com `jest-mock-extended`
  - Estruturação de testes com `describe` aninhados
  - Princípio de responsabilidade única por teste
- **Visão Geral do Projeto**: Consulte `project.mdc` para entender arquitetura de injeção de dependência e conexão entre camadas (Controllers ↔ Services ↔ Repositories)
- **Construção de Tarefas**: Esta tarefa segue as diretrizes de `build-improve-tasks.mdc` para estruturação e detalhamento

### 6. Exemplos de Refatoração

#### Antes (Problema):
```typescript
// ❌ Repetição de setup em cada teste
it('should create user successfully', async () => {
    // arrange - código duplicado
    createUserService.execute.mockResolvedValueOnce(response)

    // act & assert...
})

it('should call service with correct params', async () => {
    // arrange - mesmo código duplicado
    createUserService.execute.mockResolvedValueOnce(response)

    // act & assert...
})
```

#### Depois (Solução):
```typescript
// ✅ Happy path centralizado no beforeEach
beforeEach(() => {
    // Setup padrão para sucesso
    createUserService.execute.mockResolvedValue(response)
})

it('should create user successfully', async () => {
    // act & assert (sem arrange repetido)
})

it('should call service with correct params', async () => {
    // act & assert (sem arrange repetido)
})
```
