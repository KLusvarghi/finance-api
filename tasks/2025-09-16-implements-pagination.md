---
id: 2025-09-16-implements-pagination
titulo: Implementar Paginação por Cursor na Rota GetTransactions
tipo: feat
execucao_automatica: false
---

## 1) Contexto & Motivação

Atualmente, a rota `GET /api/transactions` retorna todas as transações de um usuário de uma só vez. Isso pode levar a problemas de performance e alto consumo de memória tanto no back-end quanto no front-end, especialmente para usuários com um grande volume de dados.

Para resolver isso, implementaremos a paginação por cursor (`cursor-based pagination`). Essa estratégia é eficiente, escalável e ideal para funcionalidades de "scroll infinito" no cliente, pois evita problemas de inconsistência de dados que podem ocorrer com a paginação tradicional baseada em `offset`.

## 2) Objetivo (Outcome)

A rota `GET /api/transactions` será paginada. Ela passará a aceitar os parâmetros de query opcionais `limit` e `cursor`. A estrutura da resposta será modificada de um array de transações para um objeto contendo os dados da página atual e o cursor para a próxima página.

**Exemplo de Resposta:**

```json
{
    "success": true,
    "message": "Transactions retrieved successfully.",
    "data": {
        "transactions": [
            // ... lista de transações da página
        ],
        "nextCursor": "a1b2c3d4-e5f6-7890-1234-567890abcdef" // ID da última transação da lista
    }
}
```

## 3) Prechecks

- [ ] Garantir que a branch de trabalho esteja atualizada com a `main`/`develop`.
- [ ] Rodar a suíte de testes atual para confirmar que tudo está passando antes de iniciar: `pnpm test`.

## 4) Plano Passo a Passo

### Passo 1: Atualizar o Schema de Validação (Zod)

- No arquivo `src/schemas/transaction.ts`, modifique o schema `getTransactionsByUserIdQuerySchema`.
- Adicione dois campos opcionais:
    - `limit`: Deve ser um número inteiro positivo, **com valor máximo de 100 para prevenir abuso da API**. Use `z.coerce.number().int().positive().max(30).optional().default(20)`. `coerce` é importante para converter a string da query para número.
    - `cursor`: Deve ser uma string (o ID da última transação), então use `z.string().optional()`.

### Passo 2: Ajustar o Repository (`PostgresGetTransactionsByUserIdRepository`)

- Esta é a alteração central. No arquivo `src/repositories/postgres/transactions/get-transactions-by-user-id.ts`.
- Modifique a assinatura do método `execute` para aceitar um objeto de opções contendo `limit` e `cursor`.
- A consulta do Prisma (`prisma.transaction.findMany`) será atualizada para usar uma técnica mais robusta que busca `limit + 1` itens para determinar a existência de uma próxima página.
    - Defina uma variável `const itemsToFetch = limit + 1`.
    - Use `take: itemsToFetch` na consulta do Prisma.
    - Use uma ordenação estável e determinística. **É crucial usar um segundo critério de ordenação único** para evitar inconsistências caso duas transações tenham o mesmo `date`. Use: `orderBy: [{ date: 'desc' }, { id: 'asc' }]`.
    - Adicione o bloco do cursor condicionalmente: `...(cursor && { cursor: { id: cursor }, skip: 1 })`. O `skip: 1` é essencial para não incluir o item do cursor na nova página.
- O método agora deve processar o resultado para definir o `nextCursor`.
    - Busque os items: `const items = await prisma.transaction.findMany(...)`.
    - Inicialize `let nextCursor: string | null = null`.
    - Se o número de itens retornados for `itemsToFetch` (ou seja, `limit + 1`), isso significa que há uma próxima página.
        - O `nextCursor` será o `id` do item de índice `limit` (o último item da página atual).
        - **Importante:** Remova o item extra da lista antes de retorná-la: `const transactions = items.slice(0, limit)`.
    - O método deve retornar um objeto contendo a lista de `transactions` (com no máximo `limit` itens) e o `nextCursor`.

### Passo 3: Atualizar a Camada de Serviço (`GetTransactionsByUserIdService`)

- No arquivo `src/services/transactions/get-transactions-by-user-id.ts`.
- Atualize a assinatura do método `execute` para receber `limit` e `cursor` e repassá-los para o repositório.
- O tipo de retorno do serviço mudará. Ele agora deve retornar o objeto `{ transactions, nextCursor }` recebido do repositório.

### Passo 4: Modificar o Controller (`GetTransactionsByUserIdController`)

- No arquivo `src/controllers/transactions/get-transactions-by-user-id.ts`.
- Extraia `limit` e `cursor` do `httpRequest.query`.
- Passe esses valores para o `getTransactionByUserIdService.execute`.
- O retorno do controller mudará. Use o helper `ok()` para retornar a nova estrutura de dados: `return ok({ transactions, nextCursor })`.

### Passo 5: Atualizar os Testes

- **Testes E2E (`src/routes/transactions.e2e.test.ts`):**
    - Crie um cenário com um número de transações maior que o `limit` padrão (ex: 25 transações).
    - **Teste 1:** Faça uma chamada `GET /api/transactions` sem parâmetros. Verifique se a resposta contém `limit` (20) transações e um `nextCursor` não nulo.
    - **Teste 2:** Use o `nextCursor` da primeira resposta para fazer uma segunda chamada. Verifique se a resposta contém as transações restantes (5) e se o `nextCursor` é `null`.
    - **Teste 3:** Faça uma chamada com um `limit` customizado (ex: `?limit=5`) e valide se o número de itens retornados está correto.
- **Testes de Unidade (`.test.ts` de Service e Controller):**
    - Atualize os mocks e as asserções para refletir as novas assinaturas de método e os novos formatos de retorno.

## 5) Arquivos-alvo & Globs

- `src/schemas/transaction.ts`
- `src/repositories/postgres/transactions/get-transactions-by-user-id.ts`
- `src/services/transactions/get-transactions-by-user-id.ts`
- `src/controllers/transactions/get-transactions-by-user-id.ts`
- `src/routes/transactions.e2e.test.ts`
- `src/services/transactions/get-transactions-by-user-id.test.ts`
- `src/controllers/transactions/get-transactions-by-user-id.test.ts`
- (Possivelmente) `src/shared/types/transaction.ts` se houver tipos de retorno explícitos que precisem ser atualizados.

## 6) Exemplos de Referência

- Documentação do Prisma sobre Paginação por Cursor: [Prisma Cursor Pagination](https://www.prisma.io/docs/orm/prisma-client/queries/pagination#cursor-based-pagination)

## 7) Critérios de Aceite

- [ ] A rota `GET /api/transactions` aceita os query params opcionais `limit` e `cursor`.
- [ ] A resposta da rota segue o novo formato: `{ data: { transactions: [], nextCursor: '...' | null }, ... }`.
- [ ] Quando `cursor` é fornecido, os resultados retornados são da "próxima página".
- [ ] Quando a última página de resultados é atingida, `nextCursor` é `null`.
- [ ] Se `limit` não for fornecido, um valor padrão (20) é usado.
- [ ] Todos os testes existentes e novos passam com sucesso (`pnpm test`).
- [ ] O código passa no linter (`pnpm eslint:check`) e no formatador (`pnpm prettier:check`).

## 8) Plano de Testes

- **Unitários**: Focar na lógica de passagem de parâmetros entre Controller e Service, e nos mocks do Repository para simular o retorno paginado.
- **Integração (Repository)**: Não necessário, pois o teste E2E cobrirá a interação com o banco.
- **E2E**: Cobrir o fluxo completo, validando múltiplas páginas, o `limit` customizado e o final da paginação (`nextCursor: null`), conforme descrito no Passo 5.

## 9) Execution Hints

- `pnpm test`
- Para testar manualmente, use uma ferramenta de API (como o arquivo `resquests.http`) para chamar o endpoint:
    - `GET http://localhost:3000/api/transactions?limit=5`
    - `GET http://localhost:3000/api/transactions?limit=5&cursor=<cursor_da_resposta_anterior>`

## 10) Rollback & Pós-verificação

- Em caso de problemas, as alterações podem ser revertidas com `git revert <commit_hash>`.
- Após o deploy, monitore os logs da aplicação e verifique se a rota de transações está funcionando como esperado.

## 11) Riscos & Impacto

- **Breaking Change**: A alteração da estrutura de resposta de um array `[]` para um objeto `{ transactions: [], nextCursor: ... }` é uma quebra de contrato para qualquer cliente que já consome esta API. A comunicação e coordenação com a equipe de front-end ou outros consumidores da API é essencial.

## 12) Notas

- Nenhuma migração de banco de dados é necessária para esta tarefa. Usaremos o campo `id` existente como cursor.
- A ordenação dos resultados (`orderBy`) é crucial para que a paginação por cursor funcione de forma consistente. **É mandatório que a ordenação seja estável e única**. Por isso, usaremos uma ordenação dupla: primeiro por `date` (descendente) e depois pelo `id` (ascendente) como critério de desempate.
