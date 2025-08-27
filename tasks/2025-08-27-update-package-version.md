# Plano de Atualização de Dependências

- **Data:** `2025-08-27`
- **Branch de Análise:** `main`
- **Node.js:** `v22.16.0`
- **Package Manager:** `pnpm@9.0.0`
- **Total de Pacotes Analisados:** 19
- **Upgrades Diretos:** 15 pacotes
- **Requer Ajustes:** 4 pacotes

## Checklist Geral

- [x] Ambiente detectado (Node, PM)
- [x] Lista de atualizações gerada com `ncu`
- [x] Análise de `patch` concluída
- [x] Análise de `minor` concluída
- [x] Análise de `major` concluída
- [x] Plano de rollback definido

---

## Análise por Severidade

### Nível: Patch

#### **`@eslint/js`**

- **Versão:** `^9.31.0` → `^9.34.0`
- **Impacto SemVer:** `patch`
- **Fontes de Análise:**
    - [ESLint GitHub Releases](https://github.com/eslint/eslint/releases)
- **Superfície de Contato (Uso no Projeto):**
    - `eslint.config.js` (importação e configuração)
    - `package.json#scripts.eslint:check` e `package.json#scripts.eslint:fix`
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Bug fixes e melhorias menores entre v9.31 e v9.34**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Correções de bugs internos do ESLint que não afetam nossa configuração atual no `eslint.config.js`
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm run eslint:check`
    - `pnpm run eslint:fix`

#### **`eslint`**

- **Versão:** `^9.31.0` → `^9.34.0`
- **Impacto SemVer:** `patch`
- **Fontes de Análise:**
    - [ESLint v9.x Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- **Superfície de Contato (Uso no Projeto):**
    - `eslint.config.js`
    - `package.json#scripts.eslint:check` e `package.json#scripts.eslint:fix`
    - Usado em toda base de código TypeScript em `src/**/*.ts`
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Correções de bugs e melhorias menores**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Nossa configuração atual já usa flat config (`eslint.config.js`) e não utiliza APIs depreciadas
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm run eslint:check`
    - `pnpm run eslint:fix`

#### **`@types/node`**

- **Versão:** `^24.0.14` → `^24.3.0`
- **Impacto SemVer:** `patch`
- **Fontes de Análise:**
    - [DefinitelyTyped @types/node](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node)
- **Superfície de Contato (Uso no Projeto):**
    - Tipagens para Node.js APIs usadas em toda aplicação
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Atualizações de tipagens para Node.js APIs**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Melhorias incrementais em tipagens que não quebram compatibilidade
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm run ts:check`

#### **`@types/pg`**

- **Versão:** `^8.15.4` → `^8.15.5`
- **Impacto SemVer:** `patch`
- **Fontes de Análise:**
    - [DefinitelyTyped @types/pg](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/pg)
- **Superfície de Contato (Uso no Projeto):**
    - Tipagens para PostgreSQL driver (usado via Prisma)
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Pequenas correções de tipagem**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Usamos Prisma como ORM, não acessamos pg diretamente
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm run ts:check`

#### **`dayjs`**

- **Versão:** `^1.11.13` → `^1.11.14`
- **Impacto SemVer:** `patch`
- **Fontes de Análise:**
    - [Day.js Releases](https://github.com/iamkun/dayjs/releases)
- **Superfície de Contato (Uso no Projeto):**
    - `src/repositories/postgres/transactions/*.test.ts` (5 arquivos)
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Bug fixes menores**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Usamos apenas funcionalidades básicas do dayjs nos testes
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm test`

#### **`dotenv`**

- **Versão:** `^17.2.0` → `^17.2.1`
- **Impacto SemVer:** `patch`
- **Fontes de Análise:**
    - [dotenv Releases](https://github.com/motdotla/dotenv/releases)
- **Superfície de Contato (Uso no Projeto):**
    - `package.json#dependencies`
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Correções de bugs menores**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Não usamos diretamente, apenas como dependência
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm test`

#### **`eslint-config-prettier`**

- **Versão:** `^10.1.5` → `^10.1.8`
- **Impacto SemVer:** `patch`
- **Fontes de Análise:**
    - [eslint-config-prettier Releases](https://github.com/prettier/eslint-config-prettier/releases)
- **Superfície de Contato (Uso no Projeto):**
    - Não está sendo usado diretamente no `eslint.config.js` atual
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Atualizações de compatibilidade com ESLint**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Não utilizamos esta configuração no projeto atualmente
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm run eslint:check`

#### **`jest`**

- **Versão:** `^30.0.5` → `^30.1.0`
- **Impacto SemVer:** `patch`
- **Fontes de Análise:**
    - [Jest Releases](https://github.com/jestjs/jest/releases)
- **Superfície de Contato (Uso no Projeto):**
    - `jest.config.ts`, `jest.global-setup.ts`, `jest.setup-after-env.ts`
    - Todos os arquivos `*.test.ts` (35+ arquivos)
    - `package.json#scripts.test`
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Correções de bugs e melhorias de performance**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Melhorias internas que não afetam nossa configuração atual
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm test`
    - `pnpm run test:coverage`

#### **`tsx`**

- **Versão:** `^4.20.3` → `^4.20.5`
- **Impacto SemVer:** `patch`
- **Fontes de Análise:**
    - [tsx Releases](https://github.com/esbuild-kit/tsx/releases)
- **Superfície de Contato (Uso no Projeto):**
    - `package.json#scripts.start:dev` e `package.json#scripts.start`
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Bug fixes menores**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Correções internas que não afetam execução básica
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm run start:dev` (teste básico)

#### **`typescript`**

- **Versão:** `^5.8.3` → `^5.9.2`
- **Impacto SemVer:** `patch`
- **Fontes de Análise:**
    - [TypeScript 5.9 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-9/)
- **Superfície de Contato (Uso no Projeto):**
    - `tsconfig.json`
    - `package.json#scripts.ts:check` e `package.json#scripts.build`
    - Toda base de código TypeScript
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Melhorias de performance e correções de bugs**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Não utilizamos recursos experimentais ou edge cases afetados
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm run ts:check`
    - `pnpm run build`

#### **`typescript-eslint`**

- **Versão:** `^8.37.0` → `^8.41.0`
- **Impacto SemVer:** `patch`
- **Fontes de Análise:**
    - [TypeScript ESLint Releases](https://github.com/typescript-eslint/typescript-eslint/releases)
- **Superfície de Contato (Uso no Projeto):**
    - `eslint.config.js` (configuração typescript-eslint)
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Correções de regras e melhorias de performance**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Nossa configuração usa regras padrão, não customizações afetadas
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm run eslint:check`

#### **`zod`**

- **Versão:** `^4.0.14` → `^4.1.3`
- **Impacto SemVer:** `patch`
- **Fontes de Análise:**
    - [Zod v4 Release Notes](https://zod.dev/v4)
- **Superfície de Contato (Uso no Projeto):**
    - `src/controllers/_helpers/validator.ts`
    - `src/schemas/user.ts` e `src/schemas/transaction.ts`
    - `src/controllers/users/*.ts` e `src/controllers/transactions/*.ts`
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Correções de bugs e melhorias menores**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Usamos apenas funcionalidades básicas do Zod (object, string, number, validation)
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm test`
    - `pnpm run ts:check`

### Nível: Minor

#### **`@prisma/client`**

- **Versão:** `6.13.0` → `6.15.0`
- **Impacto SemVer:** `minor`
- **Fontes de Análise:**
    - [Prisma Release Notes](https://github.com/prisma/prisma/releases)
- **Superfície de Contato (Uso no Projeto):**
    - `src/repositories/postgres/**/*.ts` (22 arquivos)
    - `prisma/prisma.ts`
    - Todos os services e controllers que usam PrismaClient
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Melhorias de performance e novas funcionalidades**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Usamos apenas funcionalidades básicas do Prisma (CRUD operations, transactions)
    - **Mudança 2: Bug fixes em edge cases**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Não utilizamos funcionalidades avançadas afetadas
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm prisma generate`
    - `pnpm test`
    - `pnpm run start:dev` (teste de conexão com DB)

#### **`prisma`**

- **Versão:** `^6.13.0` → `^6.15.0`
- **Impacto SemVer:** `minor`
- **Fontes de Análise:**
    - [Prisma Release Notes](https://github.com/prisma/prisma/releases)
- **Superfície de Contato (Uso no Projeto):**
    - `prisma/schema.prisma`
    - `package.json#scripts.prepare` (prisma generate)
    - Migrations em `prisma/migrations/`
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Melhorias no CLI e Prisma Studio**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Usamos apenas comandos básicos (generate, migrate)
    - **Mudança 2: Novas funcionalidades de schema**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Nossa schema é simples e não usa recursos avançados
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm prisma generate`
    - `pnpm prisma db push --skip-generate` (em ambiente de dev)
    - `pnpm test`

### Nível: Major

#### **`@faker-js/faker`**

- **Versão:** `^9.9.0` → `^10.0.0`
- **Impacto SemVer:** `major`
- **Fontes de Análise:**
    - [Faker.js v10 Migration Guide](https://fakerjs.dev/guide/upgrading.html)
- **Superfície de Contato (Uso no Projeto):**
    - `src/test/fixtures/user.ts`
    - `src/test/fixtures/transactions.ts`
    - `src/adapters/password-hasher.test.ts`
    - `src/routes/users.e2e.test.ts`
    - Vários arquivos de teste (9 arquivos identificados)
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Migração para ESM puro**
        - **Análise de Aplicabilidade:** `Relevante`
        - **Justificativa:** Nosso projeto usa ESM (`"type": "module"` no package.json)
    - **Mudança 2: Mudança na estratégia de resolução de métodos de palavras**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Não usamos métodos `faker.word.*` no projeto
    - **Mudança 3: Remoção de métodos depreciados (faker.address._, faker.name._)**
        - **Análise de Aplicabilidade:** `Relevante`
        - **Justificativa:** Precisamos verificar se usamos estes métodos nos fixtures
    - **Mudança 4: faker.helpers.unique removido**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Não identificado uso deste método no projeto
- **Classificação Final:** `Requer Ajuste`
- **Plano de Ação:**
    - Verificar e atualizar imports nos arquivos de teste
    - Substituir `faker.name.*` por `faker.person.*` se usado
    - Substituir `faker.address.*` por `faker.location.*` se usado
    - Testar geração de dados fake nos fixtures
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm test`
    - Verificar especificamente testes que usam faker: `pnpm test src/test/fixtures/`

#### **`@types/bcrypt`**

- **Versão:** `^5.0.2` → `^6.0.0`
- **Impacto SemVer:** `major`
- **Fontes de Análise:**
    - [DefinitelyTyped @types/bcrypt](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/bcrypt)
- **Superfície de Contato (Uso no Projeto):**
    - `src/adapters/password-hasher.ts`
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Atualizações de tipagens para bcrypt**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Usamos apenas métodos básicos (hash, compare) que são estáveis
- **Classificação Final:** `Upgrade Direto`
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm run ts:check`
    - `pnpm test src/adapters/password-hasher.test.ts`

#### **`husky`**

- **Versão:** `^8.0.3` → `^9.1.7`
- **Impacto SemVer:** `major`
- **Fontes de Análise:**
    - [Husky v9 Migration Guide](https://typicode.github.io/husky/)
- **Superfície de Contato (Uso no Projeto):**
    - `package.json#scripts.prepare` (husky install)
    - `.husky/` directory (se existir)
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Nova configuração de hooks**
        - **Análise de Aplicabilidade:** `Relevante`
        - **Justificativa:** Husky v9 mudou a forma de configurar hooks
    - **Mudança 2: Remoção de dependência do Node.js em hooks**
        - **Análise de Aplicabilidade:** `Relevante`
        - **Justificativa:** Pode afetar como os hooks são executados
- **Classificação Final:** `Requer Ajuste`
- **Plano de Ação:**
    - Verificar se existe diretório `.husky/`
    - Reconfigurar hooks se necessário seguindo nova sintaxe v9
    - Atualizar script `prepare` se necessário
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm run prepare`
    - Testar commit para verificar se hooks funcionam

#### **`lint-staged`**

- **Versão:** `^13.2.3` → `^16.1.5`
- **Impacto SemVer:** `major`
- **Fontes de Análise:**
    - [lint-staged Releases](https://github.com/okonet/lint-staged/releases)
- **Superfície de Contato (Uso no Projeto):**
    - `package.json#lint-staged` (se configurado)
    - Integração com husky hooks
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Mudanças na API de configuração**
        - **Análise de Aplicabilidade:** `Relevante`
        - **Justificativa:** Pode afetar configuração existente
    - **Mudança 2: Melhorias de performance**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Melhorias internas
- **Classificação Final:** `Requer Ajuste`
- **Plano de Ação:**
    - Verificar se existe configuração `lint-staged` no package.json
    - Atualizar configuração se necessário conforme nova API
    - Testar integração com husky
- **Plano de Verificação Pós-Upgrade:**
    - Testar commit com arquivos staged para verificar lint-staged

#### **`pnpm`**

- **Versão:** `9.0.0` → `10.15.0`
- **Impacto SemVer:** `major`
- **Fontes de Análise:**
    - [pnpm v10 Release Notes](https://pnpm.io/blog/2024/03/01/v10)
- **Superfície de Contato (Uso no Projeto):**
    - `package.json#packageManager`
    - `pnpm-lock.yaml`
    - Todos os scripts npm
- **Análise de Mudanças Relevantes:**
    - **Mudança 1: Mudanças no lockfile format**
        - **Análise de Aplicabilidade:** `Relevante`
        - **Justificativa:** Pode afetar `pnpm-lock.yaml`
    - **Mudança 2: Melhorias de performance**
        - **Análise de Aplicabilidade:** `Não Aplicável`
        - **Justificativa:** Melhorias internas
- **Classificação Final:** `Requer Ajuste`
- **Plano de Ação:**
    - Atualizar `package.json#packageManager` para `pnpm@10.15.0`
    - Regenerar `pnpm-lock.yaml`
    - Verificar compatibilidade com CI/CD se houver
- **Plano de Verificação Pós-Upgrade:**
    - `pnpm install`
    - `pnpm test`
    - `pnpm run build`

---

## Resumo Executivo

### Pacotes por Classificação

**Upgrade Direto (Baixo Risco):**

- **Patch:** @eslint/js, eslint, @types/node, @types/pg, dayjs, dotenv, eslint-config-prettier, jest, tsx, typescript, typescript-eslint, zod
- **Minor:** @prisma/client, prisma
- **Major:** @types/bcrypt

**Requer Ajuste (Médio/Alto Risco):**

- **Major:** @faker-js/faker, husky, lint-staged, pnpm

### Ordem de Execução Recomendada

1. **Fase 1 - Upgrades Diretos (Patch/Minor):**
    - Atualizar todos os pacotes patch e minor simultaneamente
    - Baixo risco, podem ser feitos em batch

2. **Fase 2 - Major com Baixo Impacto:**
    - @types/bcrypt (apenas tipagens)

3. **Fase 3 - Major com Ajustes:**
    - @faker-js/faker (verificar e ajustar imports nos testes)
    - husky + lint-staged (reconfigurar hooks se necessário)
    - pnpm (atualizar packageManager e regenerar lock)

---

## Plano de Rollback

### Rollback Rápido

```bash
# Reverter package.json para versão anterior via git
git checkout HEAD~1 -- package.json pnpm-lock.yaml
pnpm install

# Verificar funcionamento
pnpm test
pnpm run build
```

### Rollback Seletivo

Para reverter pacotes específicos:

```bash
# Exemplo: reverter faker para v9
pnpm add @faker-js/faker@^9.9.0 --save-dev
pnpm test
```

---

## Execution Hints

### Comandos Principais

```bash
# Fase 1: Upgrades diretos
pnpm update @eslint/js@^9.34.0 eslint@^9.34.0 @types/node@^24.3.0 @types/pg@^8.15.5 dayjs@^1.11.14 dotenv@^17.2.1 eslint-config-prettier@^10.1.8 jest@^30.1.0 tsx@^4.20.5 typescript@^5.9.2 typescript-eslint@^8.41.0 zod@^4.1.3
pnpm update @prisma/client@6.15.0 prisma@^6.15.0
pnpm update @types/bcrypt@^6.0.0

# Fase 2: Major com ajustes
pnpm update @faker-js/faker@^10.0.0
pnpm update husky@^9.1.7 lint-staged@^16.1.5

# Atualizar pnpm globalmente
npm install -g pnpm@10.15.0
# Atualizar packageManager no package.json
# Regenerar lock: rm pnpm-lock.yaml && pnpm install

# Verificação geral
pnpm install
pnpm prisma generate
pnpm run ts:check
pnpm run eslint:check
pnpm test
pnpm run build
```

### Verificações Específicas

```bash
# Testar faker após upgrade
pnpm test src/test/fixtures/

# Testar husky após reconfigurar
git add . && git commit -m "test: husky hooks"

# Verificar Prisma
pnpm prisma generate
pnpm run start:dev # teste de conexão
```

---

## Riscos & Impacto

### Riscos Baixos

- **Patch updates:** Correções de bugs, baixa probabilidade de quebra
- **@prisma/client minor:** Funcionalidades básicas são estáveis
- **@types/bcrypt major:** Apenas tipagens, sem mudanças de runtime

### Riscos Médios

- **@faker-js/faker v10:** Mudanças de API, mas limitadas aos testes
- **husky v9:** Nova configuração, mas pode não estar em uso
- **lint-staged v16:** Pode afetar hooks de commit

### Riscos Altos

- **pnpm v10:** Mudanças no lockfile, pode afetar CI/CD

### Mitigação

- Fazer backup do `pnpm-lock.yaml` antes de atualizar pnpm
- Testar em ambiente local antes de fazer commit
- Executar suite completa de testes após cada fase
- Manter documentação de rollback acessível

---

## Notas

- **Prioridade:** Focar primeiro nos upgrades diretos para obter benefícios de segurança e performance
- **Testes:** Executar `pnpm test` após cada fase para detectar problemas cedo
- **CI/CD:** Verificar se pipeline continua funcionando após atualizar pnpm
- **Documentação:** Atualizar README.md se necessário com novas versões de dependências
