---
id: 2025-08-22-remover-null-data-respostas-http
titulo: Remover campo `data`/body nulo em respostas HTTP de erro
tipo: refactor
execucao_automatica: false
---

# Taks 01: Remover campo `data`/body nulo em respostas HTTP de erro

## 1) Contexto & Motivação

As respostas dos controllers incluem o campo `data` (ou body) mesmo em cenários de erro (`BadRequest`, `Unauthorized`, `NotFound`, `ServerError`, `NoContent`), onde seu valor é inevitavelmente `null`. Isso polui a saída, gera incerteza nos consumidores e adiciona verificações desnecessárias nos testes.

## 2) Objetivo (Outcome)

Eliminar o retorno do campo `data`/body quando ele seria `null` em respostas de erro ou `NoContent`. Para respostas de sucesso (`ok`, `created`) continua obrigatório retornar `data` não-nulo.

## 3) Prechecks

- Garantir branch limpa e testes atuais verdes: `pnpm test`
- Buscar ocorrências atuais: `rg "data:\s*null" src/controllers -n`
- Confirmar shape de helpers em `src/controllers/_helpers/http.ts`

## 4) Plano Passo a Passo

- [ ] Atualizar helpers de resposta em `src/controllers/_helpers/http.ts` para omitir `data`/body quando `null` em erros e `NoContent`.
- [ ] Ajustar (ou criar) tipos compartilhados em `src/shared/types.ts` **(ou arquivo equivalente)** removendo possibilidade de `null` nessas respostas.
- [ ] Refatorar todos os controllers para usarem os novos helpers (caso algum construa resposta manualmente).
- [ ] Atualizar testes unitários de controllers que usam `toBeNull()`/`null` nos corpos de erro.
- [ ] Atualizar testes e2e em `src/routes/**/*.e2e.test.ts` que validem shape das respostas.
- [ ] Rodar `pnpm test` e garantir total cobertura.

## 5) Arquivos-alvo & Globs

- `src/controllers/_helpers/http.ts`
- `src/shared/types.ts` (ou equivalente) — ajustar DTOs
- Glob: `src/controllers/**/*.ts`
- Glob: `src/routes/**/*.e2e.test.ts`
- Glob: `src/**/*.test.ts`

## 6) Exemplos de Referência

- Helpers atuais em `src/controllers/_helpers/http.ts`
- Mensagens em `src/shared/response-messages.ts`

## 7) Critérios de Aceite (testáveis)

- [ ] Nenhuma resposta de erro contém `data` ou body `null`.
- [ ] Respostas `200 OK` e `201 Created` continuam retornando `data` válido.
- [ ] Todos os testes existentes passam sem alterações de semântica (somente shape).
- [ ] Nova busca `rg "data:\s*null" src/controllers -n` não retorna resultados.

## 8) Plano de Testes

- Unit: validar helpers retornando objeto sem `data` quando informado `null`.
- Integration: testes de controllers para cada status de erro (400/401/404/500) garantindo shape correto.
- E2E: requests reais nos endpoints críticos (users, transactions) verificando ausência do campo `data`.

## 9) Execution Hints

```bash
pnpm test
rg "data:\s*null" src -n
```

## 10) Rollback & Pós-verificação

- Reverter commits deste task.
- Rodar novamente `pnpm test` para confirmar retorno ao estado anterior.

## 11) Riscos & Impacto

- Consumidores externos que parseiam `data` mesmo em caso de erro podem quebrar.
- Ajuste em tipos pode propagar mudanças em várias camadas; cuidado com regressões silenciosas.

## 12) Notas

- Mudança **não** altera contratos de sucesso (`200/201`).
- Caso descubra helpers duplicados em outras camadas, alinhar para usar o central.
