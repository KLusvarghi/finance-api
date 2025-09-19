Contexto para Implementação de Rate Limiting (com rate-limiter-flexible + Redis)
0) Visão geral (o que é e por que agora)

Queremos limitar requisições para:

Proteger rotas sensíveis (login, upload, criação de recursos) de abuso, brute-force e picos acidentais.

Reduzir custos (CPU, banda, storage) evitáveis.

Garantir justiça no consumo de recursos (um usuário/tenant não degrada o serviço dos demais).

Faremos isso no nível da aplicação (Node/Express 5) usando rate-limiter-flexible com Redis como armazenamento compartilhado (contador global), e uma camada de políticas declarativas (“presets”) para aplicar limites por grupos de rotas com overrides pontuais onde necessário. Haverá shadow mode (modo de medição sem bloquear) para calibrar antes de ativar bloqueios.

1) Cenário alvo (o que consideramos)

Cenário distribuído: múltiplas instâncias/pods atrás de um load balancer (autoscaling).
➜ Precisamos que o contador de requisições seja global (compartilhado), não por processo.

Proxies/CDN (Cloudflare/Nginx): precisamos do IP real do cliente (ver “trust proxy” e cabeçalhos reais).

Rotas autenticadas e públicas: estratégias de chave (“quem conta”) mudam antes e depois da autenticação.

Multi-tenant e planos (SaaS): limites diferentes por plano ou tenant.

Compatibilidade com picos (burst): permitir rajadas curtas sem abrir brecha para abuso prolongado.

2) Por que rate-limiter-flexible (e não express-rate-limit)

Armazenamento global: integra nativamente com Redis e operações atômicas (precisas sob concorrência).
Em cenários com várias instâncias, um store local “por processo” quebra o limite (cada processo conta separado).

Algoritmos mais precisos: suporta token bucket, sliding window e GCRA (evitam o “efeito de borda” da janela fixa: estouro duplo na virada do minuto).

Recursos de produção: burst control, blockDuration (bloqueio temporário, até progressivo), penalties, execEvenly (suaviza picos), insurance limiter.

Observabilidade: retorna metadados úteis (p.ex., tempo até reset) para montar headers padrão e métricas.

Tradução simples: em vez de uma “catraca” em cada servidor (que perde o controle quando abrimos mais portas), temos uma catraca central (Redis) com regras inteligentes e contagem correta para todos os servidores.

3) Princípios de design (como vamos organizar)

Políticas declarativas (“presets”): limites nomeados (ex.: auth, strict, upload, public, default, free, pro) com campos padronizados (p.ex., points, duration, burst, blockDuration, keyStrategy).
➜ Governança central, fácil de auditar e alterar sem tocar em dezenas de rotas.

Herança+override por router/rota: cada grupo de rotas recebe um preset padrão; rotas específicas podem sobrescrever para algo mais rígido.
➜ Menos repetição, mais precisão onde importa.

Fallback global: um preset default para qualquer rota que não tenha política explícita.
➜ “Rede de segurança” contra esquecimentos.

Shadow mode primeiro: medimos e enviamos headers sem bloquear; só depois ativamos o bloqueio.
➜ Rollout seguro, sem impacto inesperado no usuário.

Defesa em profundidade: combinaremos app-level com camadas anteriores (CDN/WAF/gateway).
➜ Parte do tráfego malicioso nem chega na aplicação.

4) Estratégias de chave (“quem está consumindo”)

Antes de autenticar: chave = IP (anônimo).

Depois de autenticar: chave = userId+ip (ou tenantId+userId em multi-tenant).
➜ Evita que um usuário compartilhe token e burle limites.

APIs por chave: chave = apiKey (plano Free/Pro), com quotas mensais separadas (soft/hard limit).

Proxies: habilitar trust proxy e usar o cabeçalho de IP real (ex.: CF-Connecting-IP / X-Forwarded-For) com validação.
➜ Sem isso, o IP visto pode ser o do proxy e sua contagem fica errada.

5) Políticas/presets (o que cada um define)

Cada preset terá:

Janela (duration, em segundos) com TTL correspondente no Redis (chave expira sozinha).

Limite de pontos (points = número de requisições por janela).

Burst opcional (rajada curta): janela curtíssima com pontos extras (controla picos legítimos).

blockDuration opcional: quanto tempo bloquear após ultrapassar demais (pode ser progressivo em login).

keyStrategy (ip, user, user+ip, apiKey, tenant+user).

Categoria de uso (para observabilidade/relatórios).

Presets típicos:

auth: baixo volume, agressivo contra brute-force.

strict: ainda mais rígido (login).

upload: moderado, com burst curto.

public: rotas abertas, chave por IP.

default: alto e genérico (fallback).

free, pro, enterprise: por plano (quando aplicável).

6) Algoritmos e precisão (o que ganhamos)

Token bucket/sliding window: medição contínua, sem “salto” na troca de minuto; melhor UX e justiça.

Burst control: permite “picos rápidos” legítimos sem liberar abuso sustentado.

execEvenly: suaviza a distribuição de permissões ao longo da janela (reduz picos repentinos).

blockDuration progressivo: principalmente para login (falhas repetidas → bloqueios crescentes).

Penalties: penalizar comportamentos suspeitos sem alterar a política inteira.

7) Headers e UX (como o cliente se auto-regula)

Responderemos com headers padrão:

RateLimit-Limit (limite da janela),

RateLimit-Remaining (quanto ainda falta),

RateLimit-Reset (segundos até renovar),

Retry-After (quando bloqueado).

Benefício: o cliente/front consegue aplicar backoff automatico (esperar e tentar depois), melhorando UX e evitando loops de erro. A resposta 429 será padronizada (código, mensagem, nome do preset e, se possível, tempo restante).

8) Observabilidade (como vamos medir e reagir)

Logs de 429 com: preset, rota, chave (pseudonimizada), IP/tenant (se aplicável).

Métricas (Prometheus/OpenTelemetry): contagem de 429 por rota/preset/tenant; percentil de consumo; taxa de hits vs allow.

Dashboards: top endpoints por uso do limite; mapa de IPs; tendência por versão do app.

Alertas: pico anormal em auth (possível ataque ou bug no front).

9) Rollout (como ativar com segurança)

Shadow mode em toda a API (sem bloquear; só medir e enviar headers).

Calibrar presets com base nos dados reais (ajustar points/duration/burst).

Canary: ativar enforcement (bloqueio) primeiro em rotas menos críticas.

Ativar enforcement em rotas críticas (ex.: auth) já calibradas.

Monitorar 24–72h; ajustar se necessário.

Documentar políticas e runbooks (o que fazer se um serviço legítimo for bloqueado).

10) Casos especiais (o que tratar à parte)

Login/OTP: bloquear por email+ip, com blockDuration progressivo; opcionalmente CAPTCHA após N falhas.

GraphQL: como é 1 endpoint, limitar por operationName e/ou tipo (ex.: mutation createTransaction).

WebSockets/streaming: limitar conexões simultâneas e mensagens/minuto (não por requisições HTTP).

Uploads/Downloads: offload para CDN quando possível; ainda assim manter limites para abuso (scraping/hotlink).

Batch endpoints: considerar custo por item (não apenas “1 chamada”).

11) Segurança e privacidade

PII: evite logar IP bruto por longos períodos; preferir hash com salt quando possível.

Allowlist para health checks internos e integrações críticas.

Bypass controlado (somente com credencial interna e auditoria) para rotinas administrativas.

Input validation/WAF continuam necessários (rate limit não é firewall de aplicação).

12) Testes (como validar sem código aqui, mas o que cobrir)

E2E feliz e estouro (mesmo IP com usuários distintos; mesmo user em IPs distintos).

Borda de janela (consumo perto do reset) e burst.

Headers (RateLimit-* e Retry-After) presentes e coerentes.

Cenário distribuído: simular múltiplas instâncias (“nums pods”) usando o mesmo Redis.

Shadow mode: confirmar que não bloqueia e que as métricas/headers saem.

Behind proxy: validar extração do IP real.

13) Critérios de aceite (como saber que “terminamos bem”)

Consistência global: mesmo comportamento com 1 ou N instâncias (contagem única no Redis).

Precisão: ausência do “efeito de borda” típico de janela fixa; picos curtos tolerados, abuso sustentado bloqueado.

Governança: presets versionados e documentados (o que significam e onde se aplicam).

Observabilidade: métricas/alerts funcionando; 429 com contexto útil.

UX: clientes respeitam Retry-After e não entram em loops de erro.

Rollout seguro: shadow mode feito, ajustes aplicados, enforcement ativado sem incidentes.

14) Glossário rápido

TTL (Time To Live): validade de uma chave/contador; ao expirar, o Redis apaga sozinho.

Burst: rajada curta de requisições; queremos permitir “picos legítimos”, mas frear abuso contínuo.

Shadow mode: medir e enviar headers sem bloquear (calibração segura).

Cenário distribuído: várias instâncias/pods atendendo a mesma API (autoscaling).

Key strategy: a “identidade” usada para contar (IP, userId+ip, apiKey, tenant+user).

Sliding window / Token bucket: algoritmos que fazem contagem contínua mais justa que “janela fixa”.

BlockDuration: período de bloqueio temporário após estourar muito o limite.

15) O que a outra IA deve produzir/configurar

Catálogo de presets com campos (janela, limite, burst, blockDuration, keyStrategy) e descrição de cada um.

Aplicação por router (grupos de rotas) + overrides por rota crítica (ex.: login).

Fallback global (default) para rotas sem política explícita.

Integração com Redis único para todas as instâncias; extração correta do IP real atrás de proxy/CDN.

Emissão dos headers RateLimit-* e Retry-After em todas as respostas que passam pelo limiter.

Modo sombra controlado por configuração, com telemetria (logs/métricas).

Relatórios/dashboards por preset/rota/tenant e alertas de picos de 429.

Documentação das políticas (onde aplicam, por quê, ajustes recomendados) e runbook de incidentes (como liberar temporariamente um cliente legítimo).
