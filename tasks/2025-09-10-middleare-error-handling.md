---
id: 2025-09-11-implementar-error-handling-middleware
titulo: 'Refatoração: Implementar Middleware de Error Handling e Route Adapter'
tipo: refactor
execucao_automatica: false
---

## 1) Contexto & Motivação

Atualmente, cada controller implementa sua própria lógica de tratamento de erros usando blocos `try...catch`, o que leva à duplicação de código e a possíveis inconsistências. Conforme discutido, vamos centralizar essa responsabilidade em um único middleware de erro e usar um "Route Adapter" para conectar os controllers ao Express de forma limpa, desacoplada e padronizada.

## 2) Objetivo (Outcome)

Ao final desta tarefa, a aplicação terá um sistema de tratamento de erros centralizado. Os controllers serão significativamente simplificados, contendo apenas a lógica do "caminho feliz", e todas as respostas de erro da API serão consistentes, geradas pelo `errorHandler`. A base de código estará mais limpa, alinhada aos princípios DRY e SRP, e mais fácil de manter.

## 3) Prechecks

- Garantir que a suíte de testes atual está passando: `pnpm test`
- Listar os controllers que precisarão de refatoração: `grep -r "try {" src/controllers`

## 4) Plano Passo a Passo

### Fase 1: Criação da Nova Arquitetura

- [ ] **1.1.** Criar o middleware de erro em `src/middlewares/error-handler.ts`. Ele deve, inicialmente, tratar `ZodError`, erros customizados que estendem `AppError` (como `EmailAlreadyExistsError`), e um `Error` genérico para `500 Internal Server Error`.
- [ ] **1.2.** Criar o "Route Adapter" na forma da função `adaptRoute` em `src/routes/adapters/express-route-adapter.ts`. Esta função será responsável por executar o controller e capturar qualquer erro, passando-o para `next(error)`.
- [ ] **1.3.** Criar os testes unitários para o `express-route-adapter.ts` em um novo arquivo `express-route-adapter.test.ts`. Os testes devem cobrir:
    - O cenário de sucesso (chamando `res.status` e `res.json` corretamente).
    - O cenário de erro (chamando `next` com o erro lançado pelo controller).
    - O correto mapeamento dos dados de `req` para o `httpRequest`.

### Fase 2: Integração e Prova de Conceito (PoC)

- [ ] **2.1.** Registrar o `errorHandler` no arquivo `src/app.ts`, garantindo que ele seja o **último** middleware a ser adicionado com `app.use()`.
- [ ] **2.2.** Escolher o `CreateUserController` como nosso caso de teste inicial.
- [ ] **2.3.** Refatorar `src/controllers/users/create-user.ts` para remover completamente o bloco `try...catch`. A lógica deve apenas validar, chamar o serviço e retornar a resposta de sucesso.
- [ ] **2.4.** Atualizar os testes em `src/controllers/users/create-user.test.ts`. Os testes que antes esperavam uma resposta de erro (`statusCode` 400, etc.) devem ser alterados para esperar que a execução do controller lance a exceção apropriada (ex: `await expect(promise).rejects.toThrow(ZodError)`).
- [ ] **2.5.** Modificar a rota `POST /api/users` em `src/routes/users.ts` para utilizar `adaptRoute(makeCreateUserController())`.
- [ ] **2.6.** Rodar os testes E2E específicos de usuários (`src/routes/users.e2e.test.ts`) para validar que o comportamento externo da API (respostas de sucesso e erro) não foi alterado.

### Fase 3: Expansão para a Aplicação

- [ ] **3.1.** Aplicar a refatoração (remoção do `try...catch`) para todos os outros controllers dentro de `src/controllers/`.
- [ ] **3.2.** Atualizar os testes unitários/de integração de cada controller refatorado, seguindo o padrão de `rejects.toThrow()`.
- [ ] **3.3.** Atualizar todos os arquivos de rota (`src/routes/*.ts`) para que todos os endpoints utilizem o `adaptRoute`.

### Fase 4: Verificação Final

- [ ] **4.1.** Rodar a suíte de testes completa (`pnpm test`) para garantir que nenhuma regressão foi introduzida em outras partes do sistema.
- [ ] **4.2.** Realizar uma verificação manual de importações não utilizadas nos controllers, que podem ter sobrado após a remoção dos helpers de erro.

## 5) Arquivos-alvo & Globs

- `src/middlewares/error-handler.ts` (novo)
- `src/routes/adapters/express-route-adapter.ts` (novo)
- `src/routes/adapters/express-route-adapter.test.ts` (novo)
- `src/app.ts`
- Glob: `src/controllers/**/*.ts`
- Glob: `src/controllers/**/*.test.ts`
- Glob: `src/routes/*.ts`

## 6) Critérios de Aceite (testáveis)

- [ ] Nenhum controller na pasta `src/controllers/` contém blocos `try...catch` para tratamento de erros de negócio ou validação.
- [ ] Todas as definições de rotas em `src/routes/` utilizam a função `adaptRoute`.
- [ ] O middleware `errorHandler` está corretamente registrado em `app.ts` e é o responsável por formatar todas as respostas de erro da API.
- [ ] A suíte de testes completa (unitários, integração e E2E) passa com sucesso.
- [ ] As respostas de erro da API para validação (`400`), não encontrado (`404`), conflito (`409`), etc., mantêm o mesmo formato e `statusCode` de antes da refatoração.

## 7) Plano de Testes

- **Novos Testes:** Criar testes unitários para `adaptRoute`.
- **Testes Refatorados:** Ajustar os testes de controller para verificar exceções (`throws`) em vez de respostas HTTP de erro.
- **Testes de Regressão:** Utilizar a suíte de testes E2E existente como a principal garantia de que o comportamento externo da API permanece inalterado.

## 8) Execution Hints

- `pnpm test`
- `pnpm test -- src/routes/adapters/express-route-adapter.test.ts` (para rodar os novos testes do adapter)
- `pnpm test -- src/routes/users.e2e.test.ts` (para validar a PoC)

## 9) Rollback & Pós-verificação

- **Rollback:** O método mais seguro é reverter as mudanças através do controle de versão (`git restore .` ou `git revert`).
- **Pós-verificação:** Após o deploy, monitorar os logs da aplicação em busca de erros inesperados ou `unhandled promise rejections` que possam indicar uma falha no fluxo de captura de erros.

## 11) Riscos & Impacto

- **Risco Médio:** Esta é uma refatoração estrutural que afeta o fluxo de controle de toda a aplicação. O principal risco é que um tipo de erro não seja corretamente tratado pelo `errorHandler`, resultando em um erro 500 genérico ou no travamento da requisição.
- **Mitigação:** A estratégia de Prova de Conceito (PoC) em um único controller e a validação com os testes E2E existentes são cruciais para mitigar este risco antes de expandir a mudança.
