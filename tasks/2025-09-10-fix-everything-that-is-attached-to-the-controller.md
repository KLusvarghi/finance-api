---
id: 2025-09-10-refatorar-respostas-http-e-corrigir-testes
titulo: Refatorar Código e Testes para Alinhar com o Novo Padrão de Resposta HTTP
tipo: refactor
execucao_automatica: true
---

### 1. Contexto e Objetivo

Recentemente, o padrão de respostas HTTP da API foi unificado para melhorar a consistência e a experiência do desenvolvedor front-end. A nova estrutura, implementada em `src/controllers/_helpers/http.ts`, introduz o campo booleano `success` em todas as respostas, renomeia o campo `data` para `details` em respostas de erro, e torna os campos `data` (sucesso) e `details` (erro) opcionais.

Essa mudança estrutural quebrou diversos testes e desalinhou os tipos TypeScript e as implementações dos controllers.

O **objetivo** desta tarefa é refatorar sistematicamente todas as camadas afetadas (tipos, controllers, testes) para se alinharem completamente ao novo padrão de resposta, garantindo que toda a suíte de testes passe e o código esteja consistente.

### 2. Plano de Execução

As tarefas devem ser executadas na ordem apresentada para garantir que as dependências (como tipos) sejam resolvidas primeiro.

#### Etapa 1: Fundações - Atualizar Tipos Core

- [ ] **Task 1.1**: Modificar a interface `HttpResponseBody` em `src/shared/types.ts`.
    - Adicione o campo `success: boolean`.
    - Renomeie a chave `data?: T | null` para `details?: T` e adicione uma nova chave `data?: T`. A ideia é que o body possa ter um `data` para sucesso ou `details` para erro. Vamos criar tipos mais específicos para isso.

        ```typescript
        // Sugestão de alteração em src/shared/types.ts

        // Renomear a interface existente para refletir um corpo genérico
        export interface HttpResponseBody<T = unknown> {
            success: boolean
            message: string
            code?: string
            data?: T
            details?: T
        }

        // Você pode precisar de tipos mais específicos para sucesso e erro se quiser ser mais estrito
        export interface HttpResponseSuccessBody<T = unknown> {
            success: true
            message: string
            data?: T
        }

        export interface HttpResponseErrorBody<T = unknown> {
            success: false
            message: string
            code: string
            details?: T
        }

        export type HttpResponse<T = unknown> = {
            statusCode: number
            body: HttpResponseSuccessBody<T> | HttpResponseErrorBody<T> | null
        }
        ```

        _Obs: A sugestão acima é um guia. A IA deve implementar a melhor abordagem para os tipos._

#### Etapa 2: Corrigir Testes Quebrados

- [ ] **Task 2.1**: Corrigir a chamada ao helper em `refresh-token.controller.ts`.
    - A causa da falha nos testes é que o controller está passando o `code` do erro como se fosse a `message`.
    - Altere a chamada ao helper `unauthorized` para passar a mensagem correta (`ResponseMessage.UNAUTHORIZED`) e o código do erro no parâmetro `code`.

- [ ] **Task 2.2**: Corrigir os testes em `src/controllers/users/refresh-token.test.ts`.
    - Atualize as asserções `expect(response.body?.message).toBe(...)` para validar a mensagem de "Unauthorized" padronizada, e não mais o código do erro.

- [ ] **Task 2.3**: Corrigir os testes E2E em `src/routes/transactions.e2e.test.ts`.
    - Substitua as asserções `expect(responseBody.data).toBeNull()` por `expect(responseBody.success).toBe(false)`.
    - Verifique se o corpo do erro contém a chave `details` com informações relevantes, se aplicável, em vez de `data`.

#### Etapa 3: Auditoria e Refatoração Abrangente dos Testes

- [ ] **Task 3.1**: Auditar e refatorar TODOS os testes de controller de **usuários** (`src/controllers/users/**/*.test.ts`).
    - Para cada teste, verifique e atualize as asserções para corresponderem à nova estrutura de envelope:
        - **Sucesso**: `expect(body.success).toBe(true)`, e o payload deve ser acessado via `body.data`.
        - **Erro**: `expect(body.success).toBe(false)`, e os detalhes do erro via `body.details`.

- [ ] **Task 3.2**: Auditar e refatorar TODOS os testes de controller de **transações** (`src/controllers/transactions/**/*.test.ts`).
    - Aplicar as mesmas verificações e atualizações da task anterior.

- [ ] **Task 3.3**: Auditar e refatorar os testes E2E de **usuários** (`src/routes/users.e2e.test.ts`).
    - Mesmo que os testes estejam passando, é crucial garantir que eles validem a nova estrutura (`success`, `data`/`details`) para evitar regressões futuras.

#### Etapa 4: Verificação Final

- [ ] **Task 4.1**: Revisar todos os controllers (`src/controllers/**/*.ts`) para garantir que a passagem de argumentos para os helpers de erro esteja correta (usando o terceiro parâmetro como `details`, não `data`).
- [ ] **Task 4.2**: Remover o código comentado no início do arquivo `src/controllers/_helpers/http.ts`.

### 3. Arquivos-Alvo

- `src/shared/types.ts`
- `src/controllers/users/refresh-token.controller.ts`
- `src/controllers/**/*.test.ts`
- `src/routes/**/*.e2e.test.ts`
- `src/controllers/**/*.ts` (para revisão)
- `src/controllers/_helpers/http.ts`

### 4. Critérios de Aceite

- [ ] O tipo `HttpResponse` e seus relacionados em `src/shared/types.ts` refletem com precisão o novo envelope da API.
- [ ] Todas as chamadas aos helpers HTTP (`ok`, `badRequest`, etc.) nos controllers estão corretas.
- [ ] Todas as asserções nos testes de unidade, integração e E2E validam a nova estrutura de resposta (`success`, `message`, `data?`, `code?`, `details?`).
- [ ] A suíte de testes completa é executada com 100% de sucesso (`pnpm test`).
- [ ] O código passa no linter (`pnpm eslint:check`).
- [ ] O código está formatado corretamente (`pnpm prettier:check`).
