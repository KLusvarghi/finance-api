---
id: 2025-09-10-refatorar-validacao-para-middleware
titulo: Refatorar Validação de Entrada para Middleware Dedicado
tipo: refactor
execucao_automatica: false
---

## 1) Contexto & Motivação

Atualmente, a validação dos dados de entrada (request `body`, `params`, `query`) é realizada dentro de cada controller, através de um bloco `try...catch` que invoca `schema.parseAsync()`. Esta abordagem leva à repetição de código e mistura a responsabilidade de validação com a lógica de negócio do controller.

Conforme nossa conversa, o objetivo é centralizar essa lógica em um middleware genérico, tornando os controllers mais limpos e focados exclusivamente em suas responsabilidades principais.

## 2) Objetivo (Outcome)

Ao final desta task, toda a lógica de validação de schemas Zod será removida dos controllers e delegada a um novo middleware `validate`. Os controllers receberão apenas requisições cujos dados de entrada (`body`, `params`, `query`) já foram validados com sucesso, simplificando seu fluxo e tratamento de erros.

## 3) Prechecks

- Garantir que a branch de trabalho está atualizada e que todos os testes estão passando antes de iniciar: `pnpm test`.
- Mapear todas as instâncias de validação atuais para garantir que nenhuma seja esquecida: `rg ".parseAsync" src/controllers`.

## 4) Plano Passo a Passo

- [ ] **1. Criar o Middleware de Validação:**
    - Criar o arquivo `src/middlewares/validate.ts`.
    - Implementar uma função factory `validate(schema: z.AnyZodObject)` que retorna um middleware Express.
    - Este middleware deve executar `schema.parseAsync({ body: req.body, params: req.params, query: req.query })`.
    - Em caso de `ZodError`, o middleware deve interceptar o erro e retornar uma resposta `400 Bad Request` padronizada, utilizando um helper para formatar os erros de validação.

- [ ] **2. Criar Schemas Comuns e Reutilizáveis:**
    - Criar o arquivo `src/schemas/common.ts`.
    - Definir e exportar um `uuidSchema = z.string().uuid()` para ser reutilizado em todas as validações de ID.

- [ ] **3. Refatorar os Schemas Zod:**
    - Modificar os schemas em `src/schemas/user.ts` e `src/schemas/transaction.ts`.
    - Cada schema de validação de rota deve agora definir explicitamente qual parte da requisição ele valida. Exemplo: `z.object({ params: z.object({ userId: uuidSchema }) })` ou `z.object({ body: createUserBodySchema })`.
    - Criar schemas menores e específicos para operações que validam apenas `params` (ex: `deleteTransactionSchema`, `getUserByIdSchema`).

- [ ] **4. Refatorar Controllers para Remover a Lógica de Validação:**
    - Percorrer todos os controllers em `src/controllers/users/` e `src/controllers/transactions/`.
    - Remover o bloco `try...catch` que lida com `ZodError`.
    - Remover a chamada `await schema.parseAsync(...)`.
    - O método `execute` deve agora assumir que os dados da requisição são válidos.

- [ ] **5. Atualizar as Definições de Rotas:**
    - Nos arquivos `src/routes/users.ts` e `src/routes/transactions.ts`, inserir o middleware `validate()` nas rotas correspondentes.
    - A ordem deve ser: `auth` (quando necessário), `validate(schema)`, e por último o handler do controller.

- [ ] **6. Ajustar os Testes:**
    - Revisar os testes de controller (`*.test.ts`). Testes que verificavam se o controller retornava 400 para dados inválidos (erros Zod) precisarão ser ajustados ou movidos para os testes E2E, já que essa responsabilidade não é mais do controller.
    - Garantir que os testes E2E (`*.e2e.test.ts`) cubram os cenários de validação (sucesso e erro) para confirmar que o middleware está funcionando corretamente.

## 5) Arquivos‑alvo & Globs

- **Arquivos a criar:**
    - `src/middlewares/validate.ts`
    - `src/schemas/common.ts`
- **Arquivos a modificar:**
    - `src/schemas/user.ts`
    - `src/schemas/transaction.ts`
    - `src/routes/users.ts`
    - `src/routes/transactions.ts`
- **Globs:**
    - `src/controllers/users/**/*.ts`
    - `src/controllers/transactions/**/*.ts`
    - `src/routes/*.e2e.test.ts` (para garantir a cobertura de teste)

## 6) Exemplos de Referência

#### Estrutura do Middleware (`src/middlewares/validate.ts`):

```typescript
export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            params: req.params,
            query: req.query,
        })
        return next()
    } catch (error) {
        if (error instanceof ZodError) {
            // Usar helper de resposta para erro 400
        }
        // ...
    }
}
```

#### Rota (Antes):

```typescript
router.delete('/:transactionId', auth, (req, res) =>
    deleteTransactionController.execute(req, res),
)
```

#### Rota (Depois):

```typescript
router.delete(
    '/:transactionId',
    auth,
    validate(deleteTransactionSchema),
    (req, res) => deleteTransactionController.execute(req, res),
)
```

#### Controller (Antes):

```typescript
// ...
try {
    await deleteTransactionSchema.parseAsync(httpRequest.params)
    // ... lógica de negócio
} catch (error) {
    if (error instanceof ZodError) {
        // ... retorna 400
    }
    // ...
}
// ...
```

#### Controller (Depois):

```typescript
// ...
try {
    // A validação Zod foi removida
    // ... lógica de negócio
} catch (error) {
    // O catch foca apenas em erros de negócio (ex: TransactionNotFoundError)
    // ...
}
// ...
```

## 7) Critérios de Aceite (testáveis)

- [ ] O middleware `validate.ts` existe e está funcional.
- [ ] Nenhum arquivo dentro de `src/controllers/` contém chamadas a `.parseAsync()` de um schema Zod.
- [ ] Todas as rotas que recebem dados do cliente (seja `body`, `params` ou `query`) utilizam o middleware `validate`.
- [ ] Ao enviar uma requisição com dados inválidos para um endpoint, a API retorna status `400` com uma mensagem de erro de validação clara.
- [ ] Todos os testes da aplicação (`pnpm test`) passam com sucesso após a refatoração.

## 8) Plano de Testes

- **Foco Primário (E2E):** A validação deve ser confirmada através dos testes End-to-End (`*.e2e.test.ts`), pois eles testam a pipeline completa da requisição, incluindo os middlewares. Adicionar casos de teste para dados inválidos (ex: UUID mal formatado nos params, body sem campos obrigatórios) se não existirem.
- **Ajuste (Unit/Integration):** Os testes de controller devem remover as asserções que esperavam `ZodError`, pois essa lógica não pertence mais a eles.

## 9) Execution Hints

- Comando para encontrar todas as instâncias de validação a serem removidas: `rg "parseAsync" src/controllers`
- Comando para rodar todos os testes após a refatoração: `pnpm test`

## 10) Rollback & Pós‑verificação

- **Rollback:** Reverter as alterações nos arquivos-alvo através do controle de versão (`git`).
- **Pós-verificação:** Após o deploy, realizar chamadas manuais (via `requests.http` ou similar) para endpoints-chave com dados válidos e inválidos para confirmar o comportamento esperado.

## 11) Riscos & Impacto

- **Risco Médio:** A refatoração afeta um grande número de arquivos. Existe o risco de uma rota ser modificada sem a aplicação do middleware de validação, deixando-a desprotegida.
- **Mitigação:** Realizar a refatoração de forma incremental, um domínio por vez (ex: primeiro `users`, testar, depois `transactions`). Revisar todas as rotas nos arquivos `src/routes/*.ts` ao final do processo.

## 12) Notas

Esta refatoração é um passo crucial para melhorar a manutenibilidade e escalabilidade da API, alinhando o projeto a padrões de arquitetura robustos.
