---
id: 2025-09-23-correct-rate-limiter-implementation
titulo: Correção Crítica da Implementação do Rate Limiter
tipo: fix
---

### 1. Contexto e Objetivo

Após code review da implementação do Rate Limiter, foram identificados **problemas críticos de segurança** que podem permitir bypass completo do rate limiting em cenários de falha de infraestrutura, além de questões de type safety e cobertura de testes inadequada.

**Problemas críticos identificados:**
- Rate limiting é silenciosamente bypassado quando Redis falha (linhas 116-121 em `rate-limiter.ts`)
- Type casting inseguro no express-route-adapter (linhas 41-43)
- Testes unitários insuficientes (apenas 2 testes básicos vs funcionalidades críticas)
- Teste E2E de shadow mode não funciona corretamente

**Objetivo:** Corrigir todas as falhas de segurança, implementar testes abrangentes e melhorar a robustez da implementação, garantindo que o rate limiter funcione corretamente em cenários de produção e falha de infraestrutura.

### 2. Plano de Execução

#### **=4 PRIORIDADE CRÍTICA**

- [ ] **Tarefa 1:** Corrigir bypass silencioso em falhas do Redis no middleware de rate limiting
- [ ] **Tarefa 2:** Substituir type casting inseguro por interface TypeScript adequada
- [ ] **Tarefa 3:** Implementar testes unitários abrangentes para o middleware de rate limiting

#### **=à PRIORIDADE ALTA**

- [ ] **Tarefa 4:** Corrigir teste E2E de shadow mode que não está funcionando
- [ ] **Tarefa 5:** Implementar logging estruturado substituindo console.log/console.error

#### **=á PRIORIDADE MÉDIA**

- [ ] **Tarefa 6:** Padronizar headers HTTP do rate limiter
- [ ] **Tarefa 7:** Corrigir referências de `req.user` sem tipagem adequada

### 3. Arquivos-Alvo

#### **Arquivos principais a serem modificados:**
- `src/middlewares/rate-limiter.ts` - Correção do bypass e logging
- `src/middlewares/rate-limiter.test.ts` - Implementação de testes completos
- `src/routes/adapters/express-route-adapter.ts` - Correção de type safety
- `src/routes/auth.e2e.test.ts` - Correção do teste de shadow mode
- `src/config/rate-limiter-presets.ts` - Correção de tipagem do req.user

#### **Arquivos novos a serem criados:**
- `src/shared/types/express.d.ts` - Extensão da interface Express Request
- `src/shared/logger.ts` - Logger estruturado (se não existir)

### 4. Critérios de Aceite

#### **Segurança e Robustez:**
- [ ] Rate limiter NÃO deve ser bypassado quando Redis falha (retorna 503 ou erro adequado)
- [ ] Shadow mode deve funcionar corretamente apenas quando `RATE_LIMITER_SHADOW_MODE=true`
- [ ] Type casting inseguro deve ser eliminado em favor de interface TypeScript adequada

#### **Cobertura de Testes:**
- [ ] Testes unitários devem cobrir TODOS os cenários críticos:
  - [ ] Comportamento quando rate limit é excedido
  - [ ] Headers HTTP corretos (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, Retry-After)
  - [ ] Modo shadow habilitado e desabilitado
  - [ ] Diferentes presets (public, auth, strict, default)
  - [ ] Tratamento de erros do Redis
  - [ ] Geração de chaves únicas por preset

#### **Testes E2E:**
- [ ] Teste de shadow mode deve realmente habilitar a variável de ambiente
- [ ] Teste de rate limiting deve verificar headers HTTP corretos
- [ ] Testes devem ser determinísticos e não flaky

#### **Qualidade de Código:**
- [ ] Todos os testes (`npm test`) devem passar
- [ ] Code coverage deve incluir cenários de erro
- [ ] TypeScript deve compilar sem erros (`npm run build`)
- [ ] Linter deve passar sem warnings (`npm run lint`)
- [ ] **PROIBIDO** introduzir ou manter o tipo `any` - ESLint falhará

### 5. Diretrizes & Regras

#### **Arquitetura e Padrões:**
- **Visão Geral do Projeto**: Consulte `project.mdc` para manter a arquitetura hexagonal e injeção de dependência
- **Padrões de Código**: Siga `typescript.mdc` para type safety rigorosa - NUNCA use `any`
- **Testes**: Utilize `testing.mdc` para estrutura de testes com `jest-mock-extended` e cenários DRY

#### **Especificações Técnicas:**
- **Rate Limiter**: Deve falhar de forma segura (fail-safe) quando infraestrutura não estiver disponível
- **Logging**: Substituir console.* por logger estruturado conforme padrões do projeto
- **Headers HTTP**: Usar padrão `RateLimit-*` consistentemente ou documentar a escolha
- **Testes**: Implementar mocks para Redis usando `jest-mock-extended` ou em-memory store para testes

### 6. Detalhamento das Tarefas

#### **Tarefa 1: Corrigir Bypass Silencioso do Redis**
**Arquivo:** `src/middlewares/rate-limiter.ts:116-121`
**Problema:** Falhas do Redis são silenciadas, permitindo bypass total
**Solução:** Implementar fail-safe que retorna 503 quando não estiver em shadow mode

#### **Tarefa 2: Corrigir Type Casting Inseguro**
**Arquivo:** `src/routes/adapters/express-route-adapter.ts:41-43`
**Problema:** `(req as unknown as { userId: string }).userId` bypassa type system
**Solução:** Criar `src/shared/types/express.d.ts` para estender Request interface

#### **Tarefa 3: Implementar Testes Unitários Completos**
**Arquivo:** `src/middlewares/rate-limiter.test.ts`
**Problema:** Apenas 2 testes básicos, zero funcionalidade real testada
**Solução:** Implementar suite completa com mock do Redis e todos os cenários

#### **Tarefa 4: Corrigir Teste E2E Shadow Mode**
**Arquivo:** `src/routes/auth.e2e.test.ts:106-119`
**Problema:** Teste nunca habilita `RATE_LIMITER_SHADOW_MODE=true`
**Solução:** Configurar variável de ambiente corretamente no teste

#### **Tarefa 5: Implementar Logging Estruturado**
**Arquivos:** `src/middlewares/rate-limiter.ts`, `src/shared/logger.ts`
**Problema:** Uso de console.log/console.error em produção
**Solução:** Substituir por logger estruturado com metadata

#### **Tarefa 6: Padronizar Headers HTTP**
**Arquivo:** `src/middlewares/rate-limiter.ts:65-72`
**Problema:** Headers `RateLimit-*` vs `X-RateLimit-*` não documentados
**Solução:** Escolher padrão e documentar ou usar draft-spec consistentemente

#### **Tarefa 7: Corrigir Tipagem req.user**
**Arquivo:** `src/config/rate-limiter-presets.ts:26`
**Problema:** `req.user?.id` não é parte da tipagem Express padrão
**Solução:** Usar interface estendida ou casting seguro após middleware de auth

### 7. Riscos & Plano de Rollback

#### **Riscos Identificados:**
- **Alto**: Mudanças no tratamento de erro podem afetar disponibilidade da API
- **Médio**: Alterações nos headers HTTP podem quebrar clients existentes
- **Baixo**: Mudanças na tipagem podem gerar erros de compilação

#### **Plano de Rollback:**
- **Rollback Rápido**: Reverter commit específico se comportamento mudar
- **Rollback Gradual**: Feature flag para nova implementação vs antiga
- **Monitoramento**: Validar métricas de erro 429 e disponibilidade pós-deploy

#### **Validação Pré-Deploy:**
- Executar suite completa de testes em ambiente de staging
- Verificar que rate limiting ainda funciona corretamente
- Testar cenários de falha do Redis controladamente