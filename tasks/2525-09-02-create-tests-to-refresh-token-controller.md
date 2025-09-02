---
id: 2525-09-02-create-tests-to-refresh-token-controller
titulo: Criar testes para `RefreshTokenController`
tipo: chore
execucao_automatica: false
---

## 1) Contexto & Motivação

O `RefreshTokenController` foi implementado recentemente para fornecer novos tokens de acesso a partir de um **refresh token** válido. Atualmente o arquivo de teste correspondente (`src/controllers/users/refresh-token.test.ts`) contém apenas o _boilerplate_, resultando em **cobertura zero** para este fluxo crítico de autenticação.

Garantir uma suíte de testes completa para esse controlador é fundamental para:

- Proteger o fluxo de **renew** de acesso contra regressões.
- Validar tratamento de erros específicos de **JWT** (`TokenExpiredError`, `JsonWebTokenError`, `NotBeforeError`).
- Assegurar que o contrato de validação via **Zod** está funcionando e gerando respostas HTTP adequadas.
- Manter a consistência com os _standards_ definidos em `testing.mdc`.

## 2) Objetivo (Outcome)

Ao final da task, o projeto terá uma suíte de **unit tests** cobrindo 100 % dos caminhos lógicos do `RefreshTokenController`, incluindo casos de sucesso e de erro, alinhada às convenções do repositório.

## 3) Prechecks

- Garantir a branch atual **sem alterações pendentes** (`git status`).
- Executar a suíte atual para referência: `pnpm test --silent` (deve passar).
- Confirmar que o banco de dados de testes está acessível se optarmos por testes de integração (não obrigatório nesta task).

## 4) Plano Passo a Passo

- [ ] Analisar o arquivo `src/controllers/users/refresh-token.ts` para mapear caminhos de execução (feliz e exceções).
- [ ] Identificar **dependências** a serem _mockadas_ (ex.: `RefreshTokenService`).
- [ ] Criar/atualizar o arquivo `src/controllers/users/refresh-token.test.ts` implementando:
    - [ ] _Happy path_: deve retornar **200 OK** com os novos tokens quando o serviço responde com sucesso.
    - [ ] Erro de **validação Zod**: deve retornar **400 Bad Request** quando o `refreshToken` não é enviado ou é inválido (usar `it.each`).
    - [ ] Erro **TokenExpiredError**: deve retornar **401 Unauthorized** com código `TOKEN_EXPIRED`.
    - [ ] Erro **JsonWebTokenError**: deve retornar **401 Unauthorized** com código `INVALID_TOKEN`.
    - [ ] Erro **NotBeforeError**: deve retornar **401 Unauthorized** com código `TOKEN_NOT_ACTIVE`.
    - [ ] Erro **AppError** genérico: deve retornar **401 Unauthorized** propagando `error.code`.
    - [ ] Erro inesperado: deve retornar **500 Server Error**.
- [ ] Utilizar **fixtures** existentes (`tokensGeneratorAdapterResponse`) ao compor o _happy path_.
- [ ] Seguir nomenclatura de testes `should <resultado> when/if <condição>`.
- [ ] Cobrir 100 % das ramificações do `try...catch`.
- [ ] Rodar linter: `pnpm lint src/controllers/users/refresh-token.test.ts`.
- [ ] Executar testes e garantir que **todos** estão verdes.

## 5) Arquivos-alvo & Globs

- `src/controllers/users/refresh-token.test.ts`
- Glob (referência de suporte): `src/test/fixtures/**/*.ts`

## 6) Exemplos de Referência

- Estrutura de testes em `src/controllers/users/delete-user.test.ts` (para estilo e padrões de mocks).
- Uso de `it.each` em `src/services/users/create-user.test.ts` para validação de schemas.

## 7) Critérios de Aceite (testáveis)

- [ ] **Cobertura de linha** do arquivo controlador ≥ 95 % (via `pnpm test --coverage`).
- [ ] Todos os caminhos de erro listados no plano estão testados e passam.
- [ ] Nomes dos testes seguem o padrão definido em `testing.mdc`.
- [ ] Linter sem erros ou _warnings_.

## 8) Plano de Testes

- **Unitário** (foco da task): mockar `RefreshTokenService` para isolar o controlador.
- **Fixtures**: utilizar `tokensGeneratorAdapterResponse` para _happy path_.
- **Mocks**: usar `jest.spyOn` para simular lançamentos de erros do serviço.

## 9) Execution Hints

```bash
# Executar testes com cobertura
pnpm test -- src/controllers/users/refresh-token.test.ts --coverage

# Lint específico do arquivo
pnpm eslint src/controllers/users/refresh-token.test.ts
```

## 10) Rollback & Pós-verificação

- Em caso de falhas inesperadas, restaurar `refresh-token.test.ts` ao estado anterior (`git checkout -- src/controllers/users/refresh-token.test.ts`).
- Reexecutar `pnpm test` para validar suite existente.

## 11) Riscos & Impacto

- **Falsos positivos** se mocks forem configurados incorretamente (garantir asserções de chamadas).
- **Manutenção**: alterações futuras no controlador podem quebrar testes; garantir que testes sejam claros e de fácil ajuste.

## 12) Notas

- Esta task **não** requer integração com banco de dados.
- Caso deseje adicionar integrações futuras, criar nova task seguindo regras de `improve-tasks.mdc`.
