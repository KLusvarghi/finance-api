# Finance App API

> **Status:** Em desenvolvimento (v1.0.0 – _beta_)

## Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias & Justificativa](#tecnologias--justificativa)
4. [Como Rodar](#como-rodar)
5. [Estrutura de Pastas](#estrutura-de-pastas)
6. [Padrões de Código & Qualidade](#padrões-de-código--qualidade)
7. [Domínio & Banco de Dados](#domínio--banco-de-dados)
8. [API](#api)
9. [Segurança](#segurança)
10. [Observabilidade](#observabilidade)
11. [Testes](#testes)
12. [CI/CD](#cicd)
13. [Roadmap](#roadmap)
14. [Licença](#licença)
15. [Links Úteis](#links-úteis)

---

## Visão Geral

API REST para gerenciamento financeiro pessoal, permitindo que usuários registrem receitas, despesas e investimentos, consultem saldo e acompanhem transações.

- **Escopo:** CRUD de usuários e transações financeiras.
- **Público-alvo:** Desenvolvedores de aplicativos web/mobile que necessitam de um backend financeiro simples.
- **Screenshot / GIF:** _TBD_

---

## Arquitetura

Camadas principais e responsabilidades:

| Camada             | Responsabilidade                                                   | Principais Pastas  |
| ------------------ | ------------------------------------------------------------------ | ------------------ |
| Controller         | Receber requisições HTTP, validar entrada, orquestrar casos de uso | `src/controllers`  |
| Service / Use-Case | Regras de negócio independentes de infra                           | `src/services`     |
| Repository         | Persistência (PostgreSQL via Prisma)                               | `src/repositories` |
| Infra              | Conexão com DB, utilitários externos                               | `src/infra`        |

### Diagrama de Blocos (alto nível)

```mermaid
flowchart TD
    Client -->|HTTP| API[Express 5]
    API --> Controller
    Controller --> Service
    Service --> Repository
    Repository -->|Prisma| PostgreSQL[(DB)]
```

### Decisões Técnicas & Trade-offs

| #   | Decisão                      | Alternativas       | Trade-offs                                      |
| --- | ---------------------------- | ------------------ | ----------------------------------------------- |
| 1   | TypeScript em todo o backend | JavaScript puro    | + Tipagem estática, - curva de entrada          |
| 2   | Prisma ORM                   | TypeORM, Sequelize | + Migrations, DX, - abstração extra             |
| 3   | Express 5                    | Fastify, NestJS    | + Simplicidade, - Sem REST helpers nativos      |
| 4   | UUID v4 como PK              | Auto-incremento    | + Distribuído, - String maior                   |
| 5   | Bcrypt para hash de senha    | Argon2             | + Popular, suporte nativo, - Argon2 mais seguro |

---

## Tecnologias & Justificativa

- **Node.js 20 + Express 5:** Ecossistema maduro, ampla comunidade.
- **TypeScript 5:** Tipagem estática melhora manutenção.
- **PostgreSQL 15:** Relacional robusto, suporte a transações.
- **Prisma 6:** ORM moderna com migrations automáticas.
- **Docker Compose:** Facilita provisionamento local de banco.
- **Jest:** Testes unitários/integração rápidos.
- **ESLint + Prettier + Husky:** Padronização de código e CI local.

---

## Como Rodar

### Pré-requisitos

- Node.js >= 20
- PNPM / NPM
- Docker & Docker Compose

### Setup Local

```bash
# clone
$ git clone https://github.com/SEU_USUARIO/finance-app-api.git && cd finance-app-api

# instale dependências
$ npm install

# suba o banco
$ docker compose up -d postgres

# configure variáveis
$ cp .env.example .env  # edite DATABASE_URL, PORT etc.

# run migrations & gerar client Prisma
$ npx prisma migrate deploy

# iniciar em desenvolvimento (hot-reload)
$ npm run start:dev
```

### Scripts Úteis

| Comando                 | Descrição                             |
| ----------------------- | ------------------------------------- |
| `npm run start:dev`     | Hot-reload via `tsx`                  |
| `npm run build`         | Compila TS para JS (`dist/`)          |
| `npm test`              | Executa testes com dotenv `.env.test` |
| `npm run test:coverage` | Cobertura Jest                        |

---

## Estrutura de Pastas

```text
├── src
│   ├── adapters        # Abstrações de infraestrutura (Hash, UUID)
│   ├── controllers     # Camada HTTP / Express
│   │   └── _helpers    # Helpers de resposta, validação
│   ├── services        # Regras de negócio (use-cases)
│   ├── repositories    # Implementações Prisma/Postgres
│   ├── schemas         # Schemas Zod (validação)
│   ├── infra           # Conexões e utilitários externos
│   └── shared          # Tipos e helpers genéricos
├── prisma              # Schema & migrations
├── tests               # (Em `src/**.test.ts`) Fixtures e mocks
└── docker-compose.yml  # Serviços locais
```

---

## Padrões de Código & Qualidade

- **Style Guide:** ESLint (`@eslint/js`) + Prettier.
- **Import Sorting:** `eslint-plugin-simple-import-sort`.
- **Commits Semânticos:** Validado por `git-commit-msg-linter` via Husky _pre-commit_.
- **Coverage Gate:** Jest > 80% _(TBD)_.

---

## Domínio & Banco de Dados

Diagrama ER (simplificado):

```mermaid
erDiagram
    USER {
        STRING id PK
        STRING first_name
        STRING last_name
        STRING email "unique"
        STRING password
    }
    TRANSACTION {
        STRING id PK
        STRING user_id FK
        STRING name
        DECIMAL amount
        DATE date
        ENUM type
    }
    USER ||--o{ TRANSACTION : "1:N"
```

---

## API

### Rotas Principais

```mermaid
flowchart LR
    subgraph Users
        U1[POST /api/users]
        U2[GET /api/users/:userId]
        U3[PATCH /api/users/:userId]
        U4[DELETE /api/users/:userId]
        U5[GET /api/users/:userId/balance]
    end
    subgraph Transactions
        T1[POST /api/transactions]
        T2[GET /api/transactions?userId=]
        T3[PATCH /api/transactions/:transactionId]
        T4[DELETE /api/transactions/:transactionId]
    end
    Client --> U1 & U2 & U3 & U4 & U5 & T1 & T2 & T3 & T4
```

#### Sequência (ex.: criação de transação)

```mermaid
sequenceDiagram
    participant C as Client
    participant API as Express
    participant DB as PostgreSQL

    C->>API: POST /api/transactions { JSON body }
    API->>DB: INSERT transaction
    DB-->>API: 201 Created
    API-->>C: Body { status: "success", data: {...} }
```

### Exemplos de Requisição

Criar usuário:

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Ada",
    "lastName": "Lovelace",
    "email": "ada@example.com",
    "password": "s3cret"
}'
```

Resposta de sucesso _(201)_:

```json
{
    "status": "success",
    "message": "Created successfully",
    "data": {
        "id": "uuid",
        "firstName": "Ada",
        "email": "ada@example.com"
    }
}
```

Formato de erro _(400)_:

```json
{
    "status": "error",
    "message": "Validation error",
    "data": {
        "field": "email",
        "error": "already in use"
    }
}
```

> Para mais exemplos consulte `resquests.http`.

---

## Segurança

- **Hash de senha:** `bcrypt` com salt 10.
- **Validação:** Schemas Zod para entrada.
- **Proteção básica:** Express Helmet _(TBD)_.
- **Autenticação:** Token JWT _(Roadmap)_.

---

## Observabilidade

- **Logs estruturados:** `console` _(substituir por Pino – Roadmap)_.
- **Tracing / Metrics:** TBD (OpenTelemetry + Prometheus).
- **Health-check:** Docker Compose healthcheck no DB de testes.

---

## Testes

- **Framework:** Jest + `@faker-js`.
- **Tipos de teste:**
    - Unitários (use-cases)
    - Integração (controllers + DB docker-test)
- **Cobertura atual:** `npm run test:coverage` – _TBD%_.

---

## CI/CD

| Etapa  | Descrição                       | Status                      |
| ------ | ------------------------------- | --------------------------- |
| Lint   | ESLint + Prettier               | ✅ Husky _pre-commit_       |
| Testes | Jest em ambiente Docker         | 🟡 Planned (GitHub Actions) |
| Build  | `tsc` + Docker image            | 🟡 Planned                  |
| Deploy | TBD (Railway / Render / Fly.io) | 🔲                          |

---

## Roadmap

- [ ] Autenticação JWT e refresh token
- [ ] Paginação e filtros em `/api/transactions`
- [ ] Logs estruturados com Pino
- [ ] Observabilidade (OpenTelemetry)
- [ ] Dockerfile multistage & CI para build automático

---

## Licença

ISC © Kauã Ortolani Lusvarghi – 2025

---

## Links Úteis

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Mermaid](https://mermaid.js.org/)
