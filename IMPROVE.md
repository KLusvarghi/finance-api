[x] Ver melhor maneira de como melhorar os validators que está em test/fixtures/
[x] implementar as mesmas melhorias nos testes de User
[x] Implementar adapters no nosso service
[x] add soft delete nas tabelas

[] padronizar as variáveis dos tests no repository
[] a validação do deleteUserRepostory tem que ser refeita, não só os testes, temos que alterar ele para não retornar null e sim um throw usernotfonunerror, e temos que tratar no teste caso a função user.delete retorne um erro e a caso o repository de um throw

Bom, será que nesse caso eu não consigo reutilizar a criação do usuário? Porque em todos os meus repositores, que estão em user, eu tenho a necessidade de criar um usuário. E provavelmente eu vou ter que replicar a mesma coisa para o transactions. Mas focando só no users, acaba que eu tenho que, para testar um certo comportamento, eu preciso mocar a criação de um usuário. Então eu tenho que criar um usuário, aí depois deletar ou algo do tipo. Será que eu não poderia, por exemplo, no meu fixtures, eu acabar criando uma função, que dentro dessa função a gente cria o usuário e retorna ele. Então ela recebe os parâmetros e retorna o usuário. Será que é válido? Porque eu penso muito na questão de uma chamada no banco, por mais que seja o banco de teste, mas uma chamada no banco, ele acaba sendo feita fora do meu repositor. Então eu fico pensando se é uma boa prática ou não.

---

[x] Arrumar os testes de deleteRepository
[x] criar tesste para getTransactionRepository
[x] Arrumar todos os controllers com a nova ordem de mensagem de erro
[x] ver o que é mais válido, verificar o result da query dentro d orepository afim de não retoranr null e não precisar tratar no service, ou tratar em ambos, ou tratar só no service?
[x] ver de implemntar o "implemnts"

[] ver com AI tipos de erros genericos que podemos criar e quais outros custom erros para podermos criar
[] ver com a ai como eu posso verificar no getuserbaçance como eu faço para saber se o user tem alguma transaction, eu faço no service ou no repository?
[] mudar o tipo de valor que o userBalance recebe de number para string

[] no meu delete-transaction eu vejo que eu não valido se o id do user passado pode ser um user id inexistente, apenas valido se existe alguma transaction antes de deletar

[] no arquivo http.ts, acho mais válido eu retirar a propriedade "data" das resposatas que provavelmente nunca terao o "data", deixando a resposta mais limpa, e deixando obrigatorio o "data" nas resposata que necessitam do data

[] ver com a ai, se é valido ao atualizar uma transação, a gente receber o userId afim de validar

[] ver com a ai se é válido retornar ""Transaction with id 208a9b50-6736-42d4-a173-cc22b024fbb3 not found", de forma que a gente expecifica o id, quais são as boas práticas? retornar apenas "transaction not found"?

[] implementar midwarre para validações de request. ver se é mais válido isso ou um midware que centraliza o tratamento dos erros (tirando essa responsabilidade do controller e centralizando em apenas um lugar)

---

# melhorias da ai

[] melhorar a tipagem dos meus: httpRequest: HttpRequest, poruqem dessa maneira eu não tenho o auto complite se é body, params ou querys que eu tenho
[] Extrair repetição de lógica de validação de ID + existência para decorators/middlewares caso evoluam para framework HTTP real (p. ex. Fastify routes).
[] Trocar console.error por logger; incluir requestId/userId no log.
[X] Usar ESLint rule para proibir imports fora do barrel (@/shared/types, etc.).
[x] Automatizar ordenação de imports.
[x] Considerar criar um tipo genérico Controller<TRequest, TResponse> para unificar assinatura e evitar repetição de execute(HttpRequest): Promise<HttpResponse<…>>.
[x] Considerar criar tipos genéricos para Services (Service<TInput, TOutput>, SimpleService<TInput, TOutput>, etc.) para unificar assinaturas e melhorar type safety.

# Roadmap de Melhorias Sugerido

Aqui está um roadmap sugerido para estruturar as melhorias para a API. Ele está dividido em fases, começando com mudanças fundamentais e avançando para refatorações mais complexas e novas funcionalidades.

---

## Fase 1: Fundações e Consistência (Baixo Esforço, Alto Impacto)

O foco desta fase é padronizar o código, melhorar a consistência da API e corrigir pequenos problemas que têm um grande impacto na qualidade e na experiência do desenvolvedor.

1.  **[ ] Padronizar Variáveis de Testes nos Repositórios**
    - **Tarefa Original**: `padronizar as variáveis dos tests no repository`.
    - **Justificativa**: Manter um padrão de nomenclatura e estrutura nas variáveis de teste (e.g., `sut`, `mockedUser`) torna os testes mais fáceis de ler e manter.

2.  **[ ] Melhorar Mensagens de Erro para Entidades Não Encontradas**
    - **Tarefa Original**: `ver com a ai se é válido retornar "Transaction with id {id} not found"`.
    - **Resposta e Justificativa**: Sim, é uma excelente prática. Incluir o ID na mensagem de erro `"{Entidade} with id {id} not found"` ajuda muito na depuração (debugging) do frontend e na análise de logs, pois você sabe exatamente qual registro estava sendo procurado. Recomendo aplicar este padrão para todas as mensagens de "não encontrado".

3.  **[ ] Refatorar o Tipo de Retorno da API em `http.ts`**
    - **Tarefa Original**: `no arquivo http.ts, retirar a propriedade "data" das respostas que provavelmente nunca terão o "data"`.
    - **Justificativa**: Isso torna a API mais limpa e previsível. Respostas de sucesso sem corpo (como um `204 No Content` para deleção) não devem ter uma chave `data`. Você pode criar tipos diferentes para `HttpResponseWithData<T>` e `HttpResponseWithoutData`.

4.  **[ ] Mudar o Tipo do `userBalance` para String na Resposta da API**
    - **Tarefa Original**: `mudar o tipo de valor que o userBalance recebe de number para string`.
    - **Justificativa**: Embora internamente você use `Decimal` (o que é ótimo), retornar valores monetários como `string` no JSON é a melhor prática para evitar problemas de precisão com ponto flutuante em JavaScript no lado do cliente. O repositório já parece fazer isso, então é só garantir que isso seja mantido em toda a API.

---

## Fase 2: Tratamento de Erros e Validações de Segurança

Esta fase foca em tornar a API mais robusta e segura, melhorando o fluxo de validação e o tratamento de erros.

1.  **[ ] Refatorar `deleteUserRepository` para Lançar Erros**
    - **Tarefa Original**: `a validação do deleteUserRepostory tem que ser refeita... alterar ele para não retornar null e sim um throw UserNotFoundError`.
    - **Justificativa**: Repositórios não devem retornar `null` quando uma entidade não é encontrada se isso for um estado excepcional. Lançar um erro (e.g., `UserNotFoundError`) torna o fluxo de controle mais explícito e força o `Service` a tratar essa exceção, evitando bugs silenciosos.

2.  **[ ] Adicionar Validação de `userId` em `delete-transaction`**
    - **Tarefa Original**: `no meu delete-transaction eu não valido se o id do user passado pode ser um user id inexistente`.
    - **Justificativa**: Esta é uma validação de segurança crucial. Antes de deletar uma transação, você deve sempre verificar se o `userId` fornecido na requisição é válido e existe no banco de dados.

3.  **[ ] Validar `userId` ao Atualizar uma Transação**
    - **Tarefa Original**: `ver com a ai, se é valido ao atualizar uma transação, a gente receber o userId afim de validar`.
    - **Resposta e Justificativa**: Sim, é absolutamente essencial. Ao atualizar uma transação, a rota deve ser algo como `PATCH /transactions/{transactionId}`. No backend, você deve obter o `userId` do usuário autenticado (geralmente de um token JWT, que é um passo futuro) e verificar se a transação com `transactionId` pertence a ele. Isso impede que um usuário modifique as transações de outro.

4.  **[ ] Implementar Middleware de Tratamento de Erros Centralizado**
    - **Tarefa Original**: `implementar midwarre ... que centraliza o tratamento dos erros`.
    - **Justificativa**: Esta é uma das melhorias mais importantes. Um middleware de erro centralizado (Error Handling Middleware) remove a lógica de `try/catch` dos controllers, limpa o código e garante que todos os erros sejam tratados de forma consistente, retornando respostas HTTP padronizadas.

5.  **[ ] Implementar Middleware para Validação de Requisições**
    - **Tarefa Original**: `implementar midwarre para validações de request`.
    - **Justificativa**: Após o middleware de erro, um middleware de validação (usando uma biblioteca como `zod` ou `joi`) para validar `body`, `params` e `query` antes que cheguem aos controllers é a melhor abordagem. Isso limpa os controllers da lógica de validação e retorna erros `400 Bad Request` claros para o cliente.

6.  **[ ] Expandir e Padronizar Erros Customizados**
    - **Tarefa Original**: `ver com AI tipos de erros genericos que podemos criar`.
    - **Justificativa**: Com um middleware de erro, você pode criar uma hierarquia de erros customizados (e.g., `NotFoundError`, `ValidationError`, `UnauthorizedError`) que seu middleware pode capturar e traduzir para os códigos de status HTTP corretos.

---

## Fase 3: Refatoração e Melhoria da Experiência do Desenvolvedor (DX)

Com a base sólida, esta fase foca em refatorar o código para ser mais reutilizável, manutenível e fácil de trabalhar.

1.  **[ ] Melhorar a Tipagem do `HttpRequest`**
    - **Tarefa Original**: `melhorar a tipagem dos meus: httpRequest: HttpRequest`.
    - **Justificativa**: Use genéricos para ter autocomplete. Em vez de `HttpRequest`, você pode ter `HttpRequest<TBody, TParams, TQuery>`, o que dará tipagem forte dentro dos seus controllers.

2.  **[ ] Criar Tipos Genéricos para Controllers e Services**
    - **Tarefa Original**: `Considerar criar um tipo genérico Controller<TRequest, TResponse>` e para `Services`.
    - **Justificativa**: Isso padroniza a assinatura de todos os controllers e serviços, reduz código repetido e melhora a segurança de tipos (`type safety`) em todo o projeto.

3.  **[ ] Substituir `console.error` por um Logger Estruturado**
    - **Tarefa Original**: `Trocar console.error por logger; incluir requestId/userId no log`.
    - **Justificativa**: Para ambientes de produção, `console.error` não é suficiente. Usar uma biblioteca de logging (como `pino` ou `winston`) permite logs estruturados (JSON), com níveis de severidade (info, warn, error), e a inclusão de contexto como `requestId` e `userId`, o que é fundamental para monitoramento e depuração.

4.  **[ ] Criar Helpers de Teste para Criação de Entidades (Test Fixtures)**
    - **Tarefa Original**: A questão sobre reutilizar a criação de usuários nos testes.
    - **Resposta e Justificativa**: Sua intuição está corretíssima. Criar uma função helper (uma "factory" ou "fixture") em `test/fixtures` para criar um usuário (e outras entidades) é uma prática padrão e recomendada. Isso centraliza a lógica de criação de dados de teste, reduz a duplicação e torna os testes mais limpos.

---

## Fase 4: Lógica de Negócio e Funcionalidades

Melhorias focadas na lógica de negócio específica da aplicação.

1.  **[ ] Clarificar Lógica de Negócio para `getUserBalance` com Zero Transações**
    - **Tarefa Original**: `ver com a ai como eu posso verificar no getuserbalance como eu faço para saber se o user tem alguma transaction`.
    - **Análise e Sugestão**: Seu repositório já calcula o balanço a partir das transações. Se não há transações, o balanço será zero, o que é o comportamento correto e esperado. A responsabilidade de exibir uma mensagem como "Você ainda não tem transações" é do frontend. O ideal é manter a responsabilidade do repositório de apenas buscar os dados.
