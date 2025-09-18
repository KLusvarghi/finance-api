---
id: 2025-09-16-implements-filters
titulo: Implementar Filtros na Rota GetTransactions
tipo: feat
execucao_automatica: false
---

## 1) Contexto & Motivação

Atualmente, a rota `GET /api/transactions` retorna todas as transações de um usuário (de forma paginada). Para melhorar a experiência do usuário e permitir uma análise de dados mais eficaz, é essencial que os usuários possam filtrar suas transações com base em critérios específicos, como tipo, período ou título.

Esta tarefa introduzirá essa capacidade de filtragem, tornando a API mais poderosa e flexível.

## 2) Objetivo (Outcome)

A rota `GET /api/transactions` passará a aceitar os seguintes parâmetros de query opcionais para filtragem:

- `title`: Para busca textual no título da transação.
- `type`: Para filtrar por tipo (`EARNING`, `EXPENSE` ou `INVESTMENT`).
- `from`: Para transações ocorridas a partir desta data (inclusivo).
- `to`: Para transações ocorridas até esta data (inclusivo).

Esses filtros, que são todos opcionais, serão combinados com a paginação existente.

**Exemplo de Requisição:**
`GET /api/transactions?type=EXPENSE&from=2025-09-01&to=2025-09-30`

## 3) Prechecks

- [ ] Garantir que a branch de trabalho esteja atualizada com a `main`/`develop`.
- [ ] Rodar a suíte de testes atual para confirmar que tudo está passando antes de iniciar: `pnpm test`.

## 4) Plano Passo a Passo

### Passo 1: Atualizar o Schema de Validação (Zod)

- No arquivo `src/schemas/transaction.ts`, modifique o schema `getTransactionsByUserIdQuerySchema`.
- Adicione os seguintes campos opcionais:
    - `title`: `z.string().optional()`
    - `type`: `z.enum(['EARNING', 'EXPENSE', 'INVESTMENT']).optional()`
    - `from`: `z.coerce.date().optional()`
    - `to`: `z.coerce.date().optional()`

### Passo 2: Ajustar o Repository (`PostgresGetTransactionsByUserIdRepository`)

- No arquivo `src/repositories/postgres/transactions/get-transactions-by-user-id.ts`.
- Modifique a assinatura do método `execute` para aceitar um objeto de opções contendo os novos filtros: `title`, `type`, `from`, `to`.
- A consulta do Prisma (`prisma.transaction.findMany`) deve ser atualizada para construir um objeto `where` dinâmico.
- O objeto `where` deve sempre conter o `userId`.
- Adicione as seguintes condições ao `where` **apenas se** os respectivos filtros forem fornecidos:
    - `title`: Use o modo `insensitive` para busca case-insensitive. Ex: `{ contains: title, mode: 'insensitive' }`
    - `type`: `{ equals: type }`
    - `date`: Para `from` e `to`, construa um objeto de data.
        - `gte: from` (maior ou igual a)
        - `lte: to` (menor ou igual a)
- **Importante**: A lógica de paginação (cursor, limit, orderBy) deve ser mantida e combinada com o objeto `where`.

### Passo 3: Atualizar a Camada de Serviço (`GetTransactionsByUserIdService`)

- No arquivo `src/services/transactions/get-transactions-by-user-id.ts`.
- Atualize a assinatura do método `execute` para receber os novos filtros e repassá-los para o repositório.

### Passo 4: Modificar o Controller (`GetTransactionsByUserIdController`)

- No arquivo `src/controllers/transactions/get-transactions-by-user-id.ts`.
- Extraia `title`, `type`, `from`, e `to` do `httpRequest.query`.
- Passe esses valores para o `getTransactionByUserIdService.execute`.

### Passo 5: Atualizar os Testes

- **Testes E2E (`src/routes/transactions.e2e.test.ts`):**
    - Adicione novos testes para validar cada filtro individualmente e em combinação.
    - **Cenário 1 (Filtro por `type`):** Crie transações de `EARNING` e `EXPENSE`. Faça uma chamada com `?type=EARNING` e verifique se apenas as transações de receita são retornadas.
    - **Cenário 2 (Filtro por `date`):** Crie transações em datas diferentes. Faça uma chamada com `?from=...` e `?to=...` e valide se apenas as transações dentro do período são retornadas.
    - **Cenário 3 (Filtro por `title`):** Crie transações com títulos diferentes (ex: "Salário", "Aluguel"). Faça uma chamada com `?title=sal` e verifique se "Salário" é retornado.
    - **Cenário 4 (Filtros Combinados):** Teste uma combinação, como `?type=EXPENSE&title=mercado`.
- **Testes de Unidade:**
    - Atualize os mocks e as asserções nos testes de Service e Controller para refletir as novas assinaturas de método.

## 5) Arquivos-alvo & Globs

- `src/schemas/transaction.ts`
- `src/repositories/postgres/transactions/get-transactions-by-user-id.ts`
- `src/services/transactions/get-transactions-by-user-id.ts`
- `src/controllers/transactions/get-transactions-by-user-id.ts`
- `src/routes/transactions.e2e.test.ts`
- `src/services/transactions/get-transactions-by-user-id.test.ts`
- `src/controllers/transactions/get-transactions-by-user-id.test.ts`

## 6) Exemplos de Referência

- Documentação do Prisma sobre Filtragem e `where`: [Prisma Filtering](https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting)

## 7) Critérios de Aceite

- [ ] A rota `GET /api/transactions` aceita os query params opcionais `title`, `type`, `from`, `to`.
- [ ] A API retorna apenas as transações que correspondem aos filtros fornecidos.
- [ ] Os filtros funcionam corretamente em conjunto com a paginação.
- [ ] Se nenhum filtro for fornecido, o comportamento original (retornar todas as transações paginadas) é mantido.
- [ ] Todos os testes existentes e novos passam com sucesso (`pnpm test`).
- [ ] O código passa no linter (`pnpm eslint:check`) e no formatador (`pnpm prettier:check`).
- [ ] Nenhum tipo `any` foi introduzido no código.

## 8) Riscos & Impacto

- **Impacto**: Baixo. Esta é uma alteração aditiva e não-quebrável (`non-breaking change`), pois todos os novos parâmetros são opcionais. Clientes existentes da API não serão afetados.

## 9) Notas

- A construção do objeto `where` no repositório deve ser feita de forma cuidadosa para adicionar as condições apenas quando os filtros são passados, evitando que um filtro `undefined` quebre a consulta.
