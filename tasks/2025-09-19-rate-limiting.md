---
id: 2025-09-19-rate-limiting
titulo: 'feat: Implementar Middleware de Rate Limiting com Redis'
tipo: feat
---

### 1. Contexto e Objetivo

Implementar um mecanismo de rate limiting robusto e escalável para proteger a API contra abuso, ataques de força bruta e picos de tráfego. A implementação usará a biblioteca `rate-limiter-flexible` com `Redis` como store compartilhado, garantindo que os limites sejam consistentes em um ambiente distribuído (múltiplas instâncias).

O objetivo é ter um sistema de políticas declarativas ("presets") que possam ser aplicadas a diferentes grupos de rotas, com a capacidade de operar em "shadow mode" para calibração antes do bloqueio efetivo.

### 2. Plano de Execução

#### Task 1: Configuração do Ambiente e Dependências

- [ ] **Instalar dependências**: Adicionar `rate-limiter-flexible` e `redis` ao `package.json`.
  ```bash
  pnpm add rate-limiter-flexible redis
  ```
- [ ] **Configurar Docker Compose**: Adicionar um serviço `redis` ao `docker-compose.yml` para o ambiente de desenvolvimento local.
- [ ] **Variáveis de Ambiente**: Adicionar as variáveis `REDIS_URL` e `RATE_LIMITER_SHADOW_MODE` ao `.env.example` e ao seu `.env` local.
- [ ] **Cliente Redis**: Modificar o arquivo `src/config/redis.ts` para exportar uma instância do cliente Redis pronta para ser usada pela aplicação.

#### Task 2: Criação das Políticas (Presets) de Rate Limiting

- [ ] Criar um novo arquivo `src/config/rate-limiter-presets.ts`.
- [ ] Neste arquivo, definir e exportar um catálogo de "presets" de rate limiting, conforme especificado no documento de contexto. Cada preset deve definir `points`, `duration`, `blockDuration`, e uma estratégia de chave (`keyGenerator`).
- [ ] Criar presets iniciais como `public`, `auth`, `strict` e `default`.

#### Task 3: Desenvolvimento do Middleware de Rate Limiting

- [ ] Criar o arquivo `src/middlewares/rate-limiter.ts`.
- [ ] Desenvolver uma factory de middleware chamada `rateLimiter`. Esta função deve aceitar o nome de um preset (ex: `'strict'`) como argumento.
- [ ] A factory deve:
    1.  Carregar a configuração do preset correspondente.
    2.  Instanciar o `RateLimiterRedis`.
    3.  Retornar um middleware Express `(req, res, next)`.
    4.  O middleware deve determinar a chave com base na estratégia do preset (IP para anônimos, `userId` para autenticados).
    5.  Consumir um ponto e, em caso de estouro do limite:
        - Se o `SHADOW_MODE` estiver ativo, apenas logar e adicionar headers, mas chamar `next()`.
        - Se inativo, responder com `429 Too Many Requests`, incluindo os headers `RateLimit-*` e `Retry-After`.
    6.  Em caso de sucesso, adicionar os headers `RateLimit-*` à resposta e chamar `next()`.

#### Task 4: Integração do Middleware na Aplicação

- [ ] **Habilitar `trust proxy`**: No arquivo `src/app.ts`, configurar `app.set('trust proxy', 1)` para garantir que o `req.ip` retorne o IP real do cliente quando atrás de um proxy.
- [ ] **Criar um Adaptador de Rota**: Modificar o `src/routes/adapters/express-router-adapter.ts` para que ele possa receber e aplicar middlewares específicos da rota, como o de rate limit.
- [ ] **Aplicar Middlewares nas Rotas**:
    - Em `src/routes/auth.ts`, aplicar o preset `strict` à rota de login (`/login`).
    - Em `src/routes/users.ts`, aplicar o preset `public` à rota de criação de usuário (`POST /`).
    - Aplicar o preset `default` como um fallback global em `src/app.ts` para todas as rotas.

#### Task 5: Implementação de Testes

- [ ] **Testes Unitários (`src/middlewares/rate-limiter.test.ts`)**:
    - [ ] Testar o middleware em `shadow mode` (deve chamar `next()` mesmo com limite estourado).
    - [ ] Testar o bloqueio efetivo quando o `shadow mode` está desativado.
    - [ ] Validar se os headers `RateLimit-*` e `Retry-After` são definidos corretamente.
    - [ ] Mockar o cliente Redis para simular diferentes cenários.
- [ ] **Testes E2E (`src/routes/auth.e2e.test.ts`)**:
    - [ ] Criar um teste que faz requisições repetidas à rota de login até receber uma resposta `429`.
    - [ ] Validar a presença e os valores dos headers de rate limiting na resposta.

### 3. Arquivos-Alvo

- `package.json`
- `docker-compose.yml`
- `.env.example`
- `src/config/redis.ts`
- `src/config/rate-limiter-presets.ts` (novo)
- `src/middlewares/rate-limiter.ts` (novo)
- `src/middlewares/rate-limiter.test.ts` (novo)
- `src/app.ts`
- `src/routes/auth.ts`
- `src/routes/users.ts`
- `src/routes/adapters/express-router-adapter.ts`
- `src/routes/auth.e2e.test.ts`

### 4. Critérios de Aceite

- [ ] Todas as dependências estão instaladas e o Redis está configurado no Docker.
- [ ] As políticas de rate limit estão definidas em um arquivo de configuração centralizado.
- [ ] O middleware de rate limit é aplicado corretamente às rotas, diferenciando usuários autenticados e anônimos.
- [ ] Requisições que excedem o limite definido são bloqueadas com status `429` (a menos que em shadow mode).
- [ ] As respostas HTTP incluem os headers `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` e `Retry-After` (quando aplicável).
- [ ] O modo "shadow" funciona conforme esperado, permitindo a passagem de requisições, mas logando as violações.
- [ ] Todos os testes (unitários e E2E) passam com sucesso (`pnpm test`).
- [ ] O código está em conformidade com as regras de lint e formatação (`pnpm eslint:check` e `pnpm prettier:check`).
