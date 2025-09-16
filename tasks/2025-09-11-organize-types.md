---
id: 2025-09-11-organize-types
titulo: 'Refatorar e Organizar o Módulo de Tipos Compartilhados'
tipo: refactor
execucao_automatica: false
---

## 1) Contexto & Motivação

O arquivo `src/shared/types.ts` cresceu e se tornou um arquivo monolítico com mais de 400 linhas, agrupando tipos de diferentes domínios da aplicação (HTTP, Usuários, Transações, Autenticação, etc.). Isso dificulta a navegação, a manutenção e a compreensão das interfaces, impactando negativamente a experiência de desenvolvimento (DX). A motivação é refatorar este arquivo, dividindo-o em módulos menores e mais coesos por responsabilidade.

## 2) Objetivo (Outcome)

Ao final desta tarefa, o arquivo `src/shared/types.ts` será removido e substituído por uma estrutura de diretório em `src/shared/types/`, onde cada arquivo conterá tipos específicos de um domínio. Todas as importações no projeto serão atualizadas para refletir a nova estrutura, e a aplicação deve continuar funcionando perfeitamente, com todos os testes e verificações de lint passando.

## 3) Prechecks

- Garantir que a branch atual está atualizada com a `main`.
- Rodar os testes e o linter para garantir que o estado inicial está limpo:
    - `pnpm test`
    - `pnpm eslint:check`

## 4) Plano Passo a Passo

- [ ] **Passo 1: Criar a Nova Estrutura de Diretórios**
    - Criar o diretório `src/shared/types`.

- [ ] **Passo 2: Dividir `src/shared/types.ts` em Arquivos Modulares**
    - Criar os seguintes arquivos dentro de `src/shared/types/` e mover as interfaces e tipos correspondentes do arquivo antigo para eles:
        - `http.ts`: Conterá tipos genéricos de requisição e resposta HTTP (`HttpRequest`, `HttpResponse`, `HttpResponseBody`, etc.).
        - `controller.ts`: Conterá as interfaces genéricas de `Controller` (`Controller`, `BodyController`, `ParamsController`, etc.).
        - `service.ts`: Conterá as interfaces genéricas de `Service` (`Service`, `SimpleService`, etc.).
        - `user.ts`: Conterá todos os tipos e interfaces relacionados ao domínio de Usuário (`UserPublicResponse`, `CreateUserParams`, `CreateUserRepository`, `CreateUserService`, etc.).
        - `transaction.ts`: Conterá todos os tipos e interfaces relacionados ao domínio de Transação (`TransactionPublicResponse`, `CreateTransactionParams`, etc.).
        - `auth.ts`: Conterá tipos específicos de autenticação (`RefreshTokenResponse`, `AuthenticateUserService`, etc.).
        - `adapter.ts`: Conterá as interfaces para os adaptadores (`TokensGeneratorAdapter`, `PasswordComparatorAdapter`, etc.).

- [ ] **Passo 3: Criar um Barrel File para Re-exportação**
    - Dentro de `src/shared/types/`, criar um arquivo `index.ts`.
    - Neste arquivo, exportar todos os tipos dos novos arquivos criados no passo anterior (ex: `export * from './http';`, `export * from './user';`, etc.). Isso facilitará a atualização das importações existentes.

- [ ] **Passo 4: Atualizar as Importações em Todo o Projeto**
    - Realizar uma busca global por importações de `src/shared/types.ts`.
    - Atualizar todos os caminhos de importação nos arquivos encontrados para apontar para o novo barrel file: `import { ... } from '@/shared'`. Como o `index.ts` faz a re-exportação, a maioria das importações só precisará ter o caminho ajustado, se necessário (o alias `@/` deve resolver para `src/`). A estrutura de importação nomeada (`{ TypeA, TypeB }`) deve permanecer a mesma.

- [ ] **Passo 5: Remover o Arquivo Antigo**
    - Após mover todos os tipos e atualizar todas as importações, deletar o arquivo `src/shared/types.ts`.

- [ ] **Passo 6: Verificação Final**
    - Rodar a suíte de testes completa para garantir que nenhuma funcionalidade foi quebrada.
    - Rodar o linter e o formatador para garantir a consistência do código.

## 5) Arquivos-alvo & Globs

- **A ser deletado**: `src/shared/types.ts`
- **A ser criado/modificado**: `src/shared/types/*.ts`
- **Globs para atualização de importações**:
    - `src/**/*.ts`

## 6) Exemplos de Referência

A estrutura a ser criada se baseia em padrões de organização de código para manutenibilidade em projetos TypeScript de larga escala. Não há um exemplo direto no repositório, pois esta é a primeira refatoração deste tipo.

## 7) Critérios de Aceite (testáveis)

- [ ] O arquivo `src/shared/types.ts` não existe mais no projeto.
- [ ] O diretório `src/shared/types/` existe e contém os arquivos modulares (`http.ts`, `user.ts`, `transaction.ts`, etc.) e um `index.ts`.
- [ ] O barrel file `src/shared/types/index.ts` exporta corretamente todos os tipos dos outros arquivos no mesmo diretório.
- [ ] Nenhuma parte da aplicação faz importações do caminho antigo (`src/shared/types.ts`).
- [ ] A suíte de testes completa passa com sucesso (`pnpm test`).
- [ ] O código passa na verificação do linter (`pnpm eslint:check`).
- [ ] O código está formatado corretamente de acordo com as regras do Prettier (`pnpm prettier:check`).

## 8) Plano de Testes

- Não é necessário criar novos testes. A suíte de testes existente (`pnpm test`) deve ser executada e passar completamente para validar que a refatoração não introduziu regressões. A verificação dos testes de integração (E2E) é especialmente crítica para garantir que os contratos da API não foram alterados.

## 9) Execution Hints

- `pnpm test`
- `pnpm eslint:check`
- `pnpm prettier:check`
- Para encontrar todos os arquivos que precisam de atualização, um comando `grep` ou a funcionalidade de "Find in Files" da IDE pode ser usada com o termo `from '@/shared'`.

## 10) Rollback & Pós-verificação

- **Rollback**: O método mais seguro para reverter as mudanças é através do controle de versão (`git restore .` ou `git checkout <commit-hash>`).
- **Pós-verificação**: Após o merge, monitorar o pipeline de CI/CD para garantir que o build e os deploys ocorram sem problemas.

## 11) Riscos & Impacto

- **Risco Baixo**: O principal risco é esquecer de atualizar alguma importação, o que levaria a erros de compilação do TypeScript. Este risco é mitigado pela execução obrigatória dos testes e do linter como critério de aceite.
- **Impacto**: O impacto no runtime é nulo, pois esta é uma refatoração de tempo de desenvolvimento. O impacto positivo será na manutenibilidade e clareza do código.

## 12) Notas

- Atenção especial deve ser dada a possíveis conflitos de nomes de tipos se eles forem movidos para arquivos diferentes e depois re-exportados. O barrel file deve unificar tudo.
- É fundamental garantir que o `tsconfig.json` e as configurações de alias de caminho (`@/`) estejam funcionando corretamente para que as novas importações resolvam sem problemas.
