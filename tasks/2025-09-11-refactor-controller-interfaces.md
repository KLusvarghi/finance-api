---
id: 2025-09-11-refactor-controller-interfaces
titulo: Refatorar e padronizar a localização das interfaces de controller
tipo: refactor
---

### 1. Contexto e Objetivo

Recentemente, uma refatoração moveu as interfaces de request (ex: `CreateUserRequest`) de `src/shared/types.ts` para seus respectivos arquivos de controller, buscando maior organização e "colocation". No entanto, a implementação gerou duas inconsistências principais:

1.  **Duplicação de Código**: Alguns arquivos de teste (ex: `refresh-token.test.ts`) recriaram as interfaces localmente em vez de importá-las do arquivo do controller, violando o princípio DRY.
2.  **Validação Incompleta**: Não foi validado se as interfaces de parâmetros que permaneceram em `types.ts` (ex: `CreateUserParams`) realmente cumprem a nova regra de serem "compartilhadas".

O **objetivo** desta tarefa é finalizar a refatoração, aplicando de forma estrita a seguinte regra: uma interface só deve permanecer em `src/shared/types.ts` se for importada em **3 ou mais arquivos** (excluindo sua própria definição). Caso contrário, deve ser movida para o escopo mais local possível (seu principal consumidor).

### 2. Plano de Execução

- [ ] **Passo 1: Eliminar Duplicação de Interfaces nos Testes**
    - Analisar todos os arquivos `*.test.ts` dentro de `src/controllers`.
    - Identificar onde as interfaces de request (ex: `RefreshTokenRequest`) foram redefinidas localmente.
    - Remover a definição duplicada e adicionar uma importação do arquivo do controller correspondente (ex: `import { RefreshTokenRequest } from './refresh-token'`).

- [ ] **Passo 2: Validar e Mover Interfaces de Parâmetros**
    - Para cada interface de `Params` que restou em `src/shared/types.ts` (ex: `CreateUserParams`, `UpdateUserParams`, `CreateTransactionParams`, etc.), usar `grep` para contar o número de arquivos que a importam.
    - Se uma interface for importada em menos de 3 arquivos, ela deve ser movida de `types.ts` para o arquivo de seu consumidor principal (provavelmente o controller ou service).
    - Atualizar todos os imports que apontavam para o local antigo.

- [ ] **Passo 3: Limpeza Final do `types.ts`**
    - Revisar o arquivo `src/shared/types.ts` e remover permanentemente todas as definições de interfaces de `Request` que foram comentadas ou se tornaram obsoletas após os passos anteriores.

### 3. Arquivos-Alvo

- `src/controllers/**/*.ts`
- `src/controllers/**/*.test.ts`
- `src/shared/types.ts`
- `src/services/**/*.ts` (potencialmente, se alguma interface for movida para lá)
- `src/repositories/**/*.ts` (potencialmente, para atualização de imports)

### 4. Critérios de Aceite

- [ ] Não há mais definições de interfaces duplicadas nos arquivos de teste dos controllers. As interfaces são sempre importadas de seu arquivo de origem.
- [ ] Todas as interfaces que permanecem em `src/shared/types.ts` são comprovadamente importadas em 3 ou mais arquivos distintos.
- [ ] O arquivo `src/shared/types.ts` está limpo, sem código comentado ou definições de `Request` que já foram movidas.
- [ ] O código está livre de erros de tipo. É **PROIBIDO** introduzir ou manter o tipo `any`.
- [ ] Todos os testes da aplicação (`npm test`) passam com sucesso.
- [ ] O código passa no linter (`npm run eslint:check`).
- [ ] O código está formatado corretamente (`npm run prettier:check`).
