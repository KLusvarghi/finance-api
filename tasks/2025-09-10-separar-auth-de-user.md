---
id: 2025-09-10-separar-auth-de-user
titulo: Finalizar a Separação da Lógica de Autenticação do Módulo de Usuário
tipo: refactor
execucao_automatica: false
---

## 1) Contexto & Motivação

Atualmente, a lógica de autenticação (login, refresh token) está parcialmente desacoplada do módulo de `User`. O processo foi iniciado, com a criação de módulos de `auth` em controllers, services, etc., e a exclusão dos arquivos antigos. No entanto, é preciso garantir que a separação foi concluída corretamente, removendo todas as responsabilidades de autenticação do módulo de usuário e movendo-as para o novo módulo de `auth`, para alinhar o código com os princípios de Single Responsibility (SRP) e Clean Architecture.

## 2) Objetivo (Outcome)

O módulo `user` (`src/controllers/users`, `src/services/users`, etc.) deve conter exclusivamente a lógica de gerenciamento de usuários (CRUD, etc.). Toda a lógica de autenticação, validação de credenciais e gerenciamento de tokens deve residir no módulo `auth`.

## 3) Prechecks

- Verificar o estado da branch `git status`.
- Garantir que todos os testes estão passando antes de iniciar: `pnpm test`.

## 4) Plano Passo a Passo

### Parte 1: Schemas (Zod)

- [ ] **Revisar `src/schemas/user.ts`**: Verificar e remover quaisquer schemas relacionados a login (`loginUserSchema`) ou refresh token (`refreshTokenSchema`). Eles devem existir apenas em `src/schemas/auth.ts`.
- [ ] **Revisar `src/schemas/auth.ts`**: Confirmar que os schemas `loginUserSchema` e `refreshTokenSchema` estão definidos e exportados corretamente.
- [ ] **Revisar `src/schemas/index.ts`**: Garantir que os schemas de autenticação estão sendo re-exportados a partir de `src/schemas/auth.ts` (`export * from './auth'`) e que não há mais tentativas de exportá-los de `src/schemas/user.ts`.

### Parte 2: Rotas (Express)

- [ ] **Revisar `src/routes/users.ts`**: Certificar-se de que não há rotas como `POST /login` ou `POST /refresh-token`. Apenas rotas relacionadas a CRUD de usuários (`/`, `/:id`, `/me`) devem permanecer.
- [ ] **Revisar `src/routes/auth.ts`**: Confirmar que as rotas `POST /login` e `POST /refresh-token` estão definidas e utilizam os controllers do módulo `auth`.
- [ ] **Revisar `src/routes/index.ts`**: Verificar se o `authRouter` de `src/routes/auth.ts` está sendo importado e registrado corretamente no Express app com o prefixo `/api`.

### Parte 3: Factories (Injeção de Dependência)

- [ ] **Revisar `src/factories/controllers/user.ts`**: Remover quaisquer factories relacionadas a `login` ou `refresh-token`.
- [ ] **Revisar `src/factories/controllers/auth.ts`**: Confirmar que as factories `makeLoginUserController` e `makeRefreshTokenController` estão implementadas e exportadas.
- [ ] **Revisar `src/factories/controllers/index.ts`**: Garantir que as factories de autenticação são re-exportadas a partir de `src/factories/controllers/auth.ts`.

### Parte 4: Testes End-to-End

- [ ] **Revisar `src/routes/users.e2e.test.ts`**: Mover todos os testes `describe` ou `it` que validam os endpoints `/api/users/login` ou `/api/users/refresh-token` para o arquivo `src/routes/auth.e2e.test.ts`.
- [ ] **Atualizar `src/routes/auth.e2e.test.ts`**: Os testes movidos devem agora apontar para as rotas corretas (ex: `/api/auth/login`).
- [ ] **Limpeza**: Remover código de teste redundante ou não utilizado do `users.e2e.test.ts`.

### Parte 5: Limpeza Final e Validação

- [ ] **Remover importações não utilizadas**: Percorrer todos os arquivos modificados nos diretórios `src/controllers/users`, `src/services/users`, `src/routes/users`, `src/factories/controllers` e `src/schemas` para remover quaisquer `import`s que se tornaram obsoletos após a refatoração.
- [ ] **Executar Linter**: Rodar `pnpm eslint:check --fix` para corrigir problemas de lint e garantir a consistência do código.
- [ ] **Executar Formatter**: Rodar `pnpm prettier:check --write` para formatar todo o código modificado.
- [ ] **Executar Testes**: Rodar `pnpm test` para garantir que a aplicação inteira continua funcionando como esperado e que nenhuma regressão foi introduzida.

## 5) Arquivos-alvo & Globs

- `src/schemas/user.ts`
- `src/schemas/auth.ts`
- `src/schemas/index.ts`
- `src/routes/users.ts`
- `src/routes/auth.ts`
- `src/routes/index.ts`
- `src/factories/controllers/user.ts`
- `src/factories/controllers/auth.ts`
- `src/factories/controllers/index.ts`
- `src/routes/users.e2e.test.ts`
- `src/routes/auth.e2e.test.ts`

## 6) Exemplos de Referência

- **Estrutura de Módulo**: A estrutura de `transactions` (`src/controllers/transactions`, `src/services/transactions`, etc.) serve como um bom exemplo de um módulo de recurso bem definido.
- **Padrão de Controller**: Seguir o padrão de `validar > executar > responder` conforme definido em `controllers-standard.mdc`.

## 7) Critérios de Aceite (testáveis)

- [ ] Não existe nenhuma menção a `login` ou `refresh-token` nos arquivos dentro de `src/controllers/users`, `src/services/users`, `src/schemas/user.ts`, `src/routes/users.ts` e `src/factories/controllers/user.ts`.
- [ ] Os endpoints `POST /api/auth/login` e `POST /api/auth/refresh-token` estão funcionais e são servidos pelo `auth.ts` router.
- [ ] Os testes E2E para login e refresh token estão em `src/routes/auth.e2e.test.ts` e passam com sucesso.
- [ ] O comando `pnpm test` é executado com sucesso, com 100% dos testes passando.
- [ ] Os comandos `pnpm eslint:check` e `pnpm prettier:check` são executados sem reportar erros.

## 8) Plano de Testes

- Focar na verificação dos testes E2E (`*.e2e.test.ts`) para garantir que os contratos da API não foram quebrados.
- Garantir que os testes de unidade (`*.test.ts`) dos controllers e serviços de `auth` e `user` continuam cobrindo os cenários de sucesso e de erro.

## 9) Execution Hints

- `pnpm test`
- `pnpm eslint:check`
- `pnpm prettier:check`
- Use `grep` para buscar por `login` ou `refresh-token` nos diretórios de `users` para garantir a limpeza completa. Ex: `grep -r "login" src/controllers/users`.

## 10) Rollback & Pós-verificação

- **Rollback**: Reverter as alterações nos arquivos-alvo através do `git restore <file>`.
- **Pós-verificação**: Após o merge, monitorar a API para garantir que as rotas de autenticação e de usuário estão funcionando como esperado em ambiente de staging/produção.

## 11) Riscos & Impacto

- **Baixo**: Esta é uma refatoração interna. Desde que os contratos da API (endpoints) sejam mantidos ou migrados corretamente (de `/api/users/login` para `/api/auth/login`), não deve haver impacto para os clientes da API. A maior parte do trabalho de exclusão/criação já foi feita, o risco é residual.

## 12) Notas

- Atenção máxima à remoção de importações não utilizadas para manter o código limpo.
- É proibido introduzir o tipo `any`. O ESLint irá falhar a build.
