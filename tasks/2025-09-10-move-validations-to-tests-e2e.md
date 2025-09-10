---
id: 2025-09-10-mover-testes-validacao-para-e2e
titulo: Mover Testes de Validação dos Controllers para Testes End-to-End
tipo: refactor
execucao_automatica: true
---

## 1) Contexto & Motivação

Após a refatoração que moveu a lógica de validação de entrada (body, params, query) dos controllers para um middleware dedicado (`validate.ts`), os testes de unidade/integração dos controllers (`*.test.ts`) que verificavam essa validação tornaram-se obsoletos e estão falhando. Esses testes chamam o método `.execute()` do controller diretamente, bypassando a camada de middleware onde a validação agora reside.

O objetivo desta tarefa é alinhar a estratégia de testes com a nova arquitetura, garantindo que a validação seja testada no nível correto (E2E) e removendo os testes redundantes dos controllers.

## 2) Objetivo (Outcome)

Ao final desta task, todos os testes de validação de schemas Zod serão removidos dos arquivos `*.test.ts` dos controllers e reimplementados nos testes `*.e2e.test.ts` correspondentes. Isso garantirá que o contrato da API seja validado de forma integrada (rota + middleware + controller) e que a base de testes reflita a arquitetura atual do sistema.

## 3) Prechecks

- Garantir que a branch de trabalho está atualizada.
- Rodar todos os testes e observar as falhas de validação nos controllers: `pnpm test`.

## 4) Plano Passo a Passo

**Diretriz Geral:** Ao adicionar os testes de validação nos arquivos E2E, **SEMPRE** utilize os casos de teste pré-definidos no arquivo `src/test/fixtures/validate.ts`. Importe os arrays de casos (ex: `invalidEmailCases`, `invalidPasswordCases`, `createInvalidNameCases`) e use-os com `it.each` para manter a consistência e evitar a duplicação de lógica de teste.

### Parte 1: Refatoração dos Testes de Usuários (`/users`)

- [ ] **1.1: Limpar Testes do `CreateUserController`**
    - **Arquivo:** `src/controllers/users/create-user.test.ts`
    - **Ação:** Remover completamente o bloco `describe('validations', () => { ... })`. Após a última refatoração, ele já foi parcialmente removido, mas é preciso garantir que qualquer resquício seja eliminado, deixando apenas os testes de `error handling` e `success cases` que focam na lógica do serviço.

- [ ] **1.2: Adicionar Testes de Validação em `users.e2e.test.ts` para Criação de Usuário**
    - **Arquivo:** `src/routes/users.e2e.test.ts`
    - **Ação:** Dentro do `describe('POST /api/users', () => { ... })`, adicionar um novo `describe('validation', () => { ... })`.
    - **Cenários a Cobrir:** Usando `it.each`, criar testes para todos os campos do `createUserSchema` (`firstName`, `lastName`, `email`, `password`), cobrindo casos como:
        - Campo não fornecido (undefined/null)
        - Campo vazio ou com espaços em branco
        - Campo mais curto que o mínimo permitido
        - Email com formato inválido
    - **Asserção:** Para cada caso, esperar `statusCode 400` e a mensagem de erro correspondente do Zod.

- [ ] **1.3: Limpar Testes do `LoginUserController`**
    - **Arquivo:** `src/controllers/users/login-user.test.ts`
    - **Ação:** Remover completamente o bloco `describe('validations', () => { ... })`.

- [ ] **1.4: Adicionar Testes de Validação em `users.e2e.test.ts` para Login**
    - **Arquivo:** `src/routes/users.e2e.test.ts`
    - **Ação:** Dentro do `describe('POST /api/users/login', () => { ... })`, adicionar um novo `describe('validation', () => { ... })`.
    - **Cenários a Cobrir:** Testar o `loginSchema` (`email`, `password`) para casos de campos ausentes, vazios ou inválidos.
    - **Asserção:** Esperar `statusCode 400` e a mensagem de erro correta.

- [ ] **1.5: Limpar Testes do `UpdateUserController`**
    - **Arquivo:** `src/controllers/users/update-user.test.ts`
    - **Ação:** Remover completamente o bloco `describe('validations', () => { ... })`.

- [ ] **1.6: Adicionar Testes de Validação em `users.e2e.test.ts` para Atualização de Usuário**
    - **Arquivo:** `src/routes/users.e2e.test.ts`
    - **Ação:** Dentro do `describe('PATCH /api/users/me', () => { ... })`, adicionar um novo `describe('validation', () => { ... })`.
    - **Cenários a Cobrir:** Testar o `updateUserSchema` para campos opcionais com dados inválidos (ex: `email` inválido, `password` muito curto) e a presença de campos não permitidos (`strict()`).
    - **Asserção:** Esperar `statusCode 400`.

- [ ] **1.7: Limpar e Adicionar Testes para `RefreshTokenController` e `GetUserBalanceController`**
    - **Arquivo (Remover):** `src/controllers/users/refresh-token.test.ts` (remover `describe('validation errors',...)`)
    - **Arquivo (Remover):** `src/controllers/users/get-user-balance.test.ts` (remover testes de validação se houver).
    - **Arquivo (Adicionar):** `src/routes/users.e2e.test.ts`
    - **Ação:** Adicionar `describe('validation', ...)` para as rotas `POST /api/users/refresh-token` e `GET /api/users/me/balance`, testando os respectivos schemas (`refreshTokenSchema` e `getUserBalanceSchema`).

### Parte 2: Refatoração dos Testes de Transações (`/transactions`)

- [ ] **2.1: Limpar Testes do `CreateTransactionController`**
    - **Arquivo:** `src/controllers/transactions/create-transaction.test.ts`
    - **Ação:** Remover completamente o bloco `describe('validations', () => { ... })`.

- [ ] **2.2: Adicionar Testes de Validação em `transactions.e2e.test.ts` para Criação de Transação**
    - **Arquivo:** `src/routes/transactions.e2e.test.ts`
    - **Ação:** Dentro do `describe('POST /api/transactions/me', () => { ... })` (renomeado de `/api/transactions`), adicionar um novo `describe('validation', () => { ... })`.
    - **Cenários a Cobrir:** Testar o `createTransactionSchema` (`name`, `date`, `type`, `amount`) para todos os casos inválidos que estavam no teste do controller.
    - **Asserção:** Esperar `statusCode 400` e a mensagem de erro correta.

- [ ] **2.3: Limpar Testes do `UpdateTransactionController`**
    - **Arquivo:** `src/controllers/transactions/update-transaction.test.ts`
    - **Ação:** Remover completamente o bloco `describe('validations', () => { ... })`.

- [ ] **2.4: Adicionar Testes de Validação em `transactions.e2e.test.ts` para Atualização de Transação**
    - **Arquivo:** `src/routes/transactions.e2e.test.ts`
    - **Ação:** Dentro do `describe('PATCH /api/transactions/me/:transactionId', () => { ... })`, adicionar um `describe('validation', () => { ... })`.
    - **Cenários a Cobrir:** Testar o `updateTransactionSchema`: `transactionId` inválido (não-UUID) no `params`, e campos inválidos no `body`.
    - **Asserção:** Esperar `statusCode 400`.

- [ ] **2.5: Limpar Testes do `DeleteTransactionController`**
    - **Arquivo:** `src/controllers/transactions/delete-transaction.test.ts`
    - **Ação:** Remover o bloco `describe('validations', () => { ... })`.

- [ ] **2.6: Adicionar Testes de Validação em `transactions.e2e.test.ts` para Deleção de Transação**
    - **Arquivo:** `src/routes/transactions.e2e.test.ts`
    - **Ação:** Dentro do `describe('DELETE /api/transactions/me/:transactionId', () => { ... })`, adicionar `describe('validation', () => { ... })`.
    - **Cenários a Cobrir:** Testar o `deleteTransactionSchema`: `transactionId` inválido (não-UUID) no `params`.
    - **Asserção:** Esperar `statusCode 400`.

## 5) Arquivos-alvo & Globs

- **Arquivos a modificar (remover testes):**
    - `src/controllers/users/create-user.test.ts`
    - `src/controllers/users/login-user.test.ts`
    - `src/controllers/users/update-user.test.ts`
    - `src/controllers/users/refresh-token.test.ts`
    - `src/controllers/users/get-user-balance.test.ts`
    - `src/controllers/transactions/create-transaction.test.ts`
    - `src/controllers/transactions/update-transaction.test.ts`
    - `src/controllers/transactions/delete-transaction.test.ts`
- **Arquivos a modificar (adicionar testes):**
    - `src/routes/users.e2e.test.ts`
    - `src/routes/transactions.e2e.test.ts`

## 6) Exemplos de Referência

#### Exemplo de Teste a ser Movido (de `create-user.test.ts`)

```typescript
// ESTE BLOCO DEVE SER REMOVIDO
describe('validations', () => {
    describe('firstName', () => {
        it.each(invalidNameCases)(
            'should return 400 if firstName is $description',
            async ({ name, expectedMessage }) => {
                const response = await sut.execute({
                    body: { ...params, firstName: name },
                })
                expect(response.statusCode).toBe(400)
                expect(response.body?.message).toBe(expectedMessage)
            },
        )
    })
    // ... outros campos ...
})
```

#### Exemplo de Como Deve Ficar no Teste E2E (`users.e2e.test.ts`)

```typescript
// NOVO BLOCO DENTRO DO `describe('POST /api/users', ...)`

// 1. Importar os casos de teste do fixture
import { invalidEmailCases } from '@/test/fixtures/validate'
import { createUserParams } from '@/test'
import request from 'supertest'
import { app } from '@/app'

describe('validation', () => {
    // 2. Usar os casos importados com it.each
    it.each(invalidEmailCases)(
        'should return 400 if email is $description',
        async ({ email, expectedMessage }) => {
            // arrange
            const invalidParams = { ...createUserParams, email }

            // act
            const { body: responseBody } = await request(app)
                .post('/api/users')
                .send(invalidParams)
                .expect(400)

            // assert
            expect(responseBody.success).toBe(false)
            expect(responseBody.message).toBe(expectedMessage)
        },
    )

    // ... repetir o padrão para password, firstName, lastName, etc.
})
```

## 7) Critérios de Aceite

- [ ] Nenhum teste de validação de schema Zod existe mais nos arquivos `src/controllers/**/*.test.ts`.
- [ ] Os arquivos `src/routes/**/*.e2e.test.ts` contêm testes de validação abrangentes para todas as rotas que utilizam o middleware `validate`.
- [ ] A cobertura de cenários de validação (campos obrigatórios, formatos, tamanhos) é igual ou superior à que existia anteriormente nos testes de controller.
- [ ] Todos os testes da aplicação (`pnpm test`) passam com sucesso após a refatoração.

## 8) Execution Hints

- `pnpm test src/controllers` para ver os testes de controller falhando antes de removê-los.
- `pnpm test src/routes` para rodar os testes E2E e garantir que os novos testes de validação funcionam e os antigos continuam passando.
- Use `it.each` extensivamente nos testes E2E para manter o código limpo e cobrir múltiplos casos de falha de forma eficiente.
