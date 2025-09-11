---
id: 2025-09-11-implementar-testes-auth-middleware
titulo: Implementar Testes Unitários e E2E para o Middleware de Autenticação
tipo: feat
execucao_automatica: false
---

## 1) Contexto & Motivação

O middleware de autenticação (`src/middlewares/auth.ts`) é uma parte crítica da segurança da aplicação, mas atualmente carece de testes dedicados. Para garantir seu comportamento correto, prevenir regressões e validar as diferentes lógicas de tratamento de erro (token ausente, inválido, expirado), é essencial adicionar uma suíte de testes unitários e estender os testes E2E existentes para cobrir cenários de falha.

## 2) Objetivo (Outcome)

Ao final desta tarefa, o middleware `auth.ts` terá uma cobertura de testes unitários robusta e os testes E2E validarão que as rotas protegidas se comportam corretamente quando um token de acesso é inválido ou ausente.

## 3) Prechecks

- Garantir que a suíte de testes atual está passando: `pnpm test`
- Verificar a estrutura de fixtures existente em `src/test/fixtures/validates/` para seguir o padrão.

## 4) Plano Passo a Passo

- [ ] **1. Criar Fixture para Casos de Autenticação Inválida**
    - Crie o arquivo `src/test/fixtures/validates/invalidTokenCases.ts`.
    - Dentro dele, exporte uma constante (ex: `invalidAuthTokenCases`) que seja um array de objetos. Cada objeto deve conter uma `description` (ex: `'should return 401 if token is missing'`) e o `token` correspondente (ex: `undefined`, `'Bearer'`, `'Bearer malformed.token.here'`).
    - Inclua casos para:
        - Token ausente (`undefined`)
        - Header sem o prefixo "Bearer "
        - Token malformado (não é um JWT válido)
        - Token com assinatura inválida
        - Token expirado

- [ ] **2. Implementar Testes Unitários para o Middleware `auth`**
    - Crie o arquivo de teste `src/middlewares/auth.test.ts`.
    - Use `jest.mock('jsonwebtoken')` para mockar o módulo `jsonwebtoken`.
    - **Cenário de Sucesso:**
        - Implemente um teste `it('should call next() and attach userId to request if token is valid')`.
        - Configure o mock de `jwt.verify` para não lançar erro e o de `jwt.decode` para retornar um payload válido (ex: `{ userId: 'valid-user-id' }`).
        - Verifique se `next()` foi chamado e se `req.userId` foi corretamente atribuído.
    - **Cenários de Falha (Parametrizados):**
        - Use `it.each(invalidAuthTokenCases)('$description', ...)` para testar todos os casos da fixture.
        - Para cada caso, simule a lógica de verificação do token (ex: mock `jwt.verify` para lançar um `JsonWebTokenError`).
        - Assert que a resposta tenha status `401` e a mensagem apropriada.
        - Assert que a função `next()` **não** seja chamada.
    - Lembre-se de mockar `console.error` para manter o output do teste limpo.

- [ ] **3. Estender Testes E2E para Rotas Protegidas**
    - Identifique rotas que utilizam o middleware `auth` nos arquivos `src/routes/users.e2e.test.ts` e `src/routes/transactions.e2e.test.ts` (ex: `GET /api/users/me`).
    - Adicione novos testes `it` para cada rota protegida para validar os seguintes cenários:
        - `it('should return 401 if authorization header is missing')`: Faça a requisição sem o header `authorization`.
        - `it('should return 401 if token is invalid')`: Faça a requisição com um token inválido no header (ex: `Bearer 123`).
    - Verifique se o status da resposta é `401` e se o corpo da resposta corresponde ao formato de erro esperado.

## 5) Arquivos-alvo & Globs

- **Novos arquivos:**
    - `src/test/fixtures/validates/invalidTokenCases.ts`
    - `src/middlewares/auth.test.ts`
- **Arquivos a modificar:**
    - `src/routes/users.e2e.test.ts`
    - `src/routes/transactions.e2e.test.ts`

## 6) Exemplos de Referência

- **Fixtures de Validação:** `src/test/fixtures/validates/createInvalidIdCases.ts`
- **Testes E2E:** `src/routes/users.e2e.test.ts` (para a estrutura dos testes existentes).

## 7) Critérios de Aceite (testáveis)

- [ ] O arquivo de fixture `invalidTokenCases.ts` foi criado e contém os casos de teste relevantes.
- [ ] O arquivo de teste `src/middlewares/auth.test.ts` foi criado e possui cobertura para o cenário de sucesso e todos os cenários de falha.
- [ ] Os testes E2E em `users.e2e.test.ts` e `transactions.e2e.test.ts` foram estendidos para cobrir requisições a rotas protegidas sem token e com token inválido.
- [ ] Todos os testes (novos e existentes) passam com sucesso ao executar `pnpm test`.

## 8) Plano de Testes

- **Unitário:** Foco total na lógica interna do `auth.ts`, com dependências (como `jsonwebtoken`) completamente mockadas.
- **E2E:** Validar o comportamento do middleware no contexto de uma requisição HTTP real, garantindo que a proteção de rota funciona como esperado para usuários não autenticados.

## 9) Execution Hints

- Para rodar apenas os novos testes unitários: `pnpm test src/middlewares/auth.test.ts`
- Para rodar a suíte completa após as alterações: `pnpm test`

## 10) Rollback & Pós-verificação

- Para reverter, remova os arquivos criados (`auth.test.ts` e `invalidTokenCases.ts`) e desfaça as alterações nos arquivos de teste E2E.
- Após a implementação, execute a suíte de testes completa para garantir que nenhuma regressão foi introduzida.

## 11) Riscos & Impacto

- **Risco:** Baixo. A tarefa consiste na adição de testes e não altera a lógica de produção.
- **Impacto:** Positivo. Aumenta a confiabilidade e a manutenibilidade do principal middleware de segurança da aplicação.

## 12) Notas

- Não há necessidade de implementar testes de integração com um app Express mockado, conforme definido. O foco é em testes unitários e E2E.
