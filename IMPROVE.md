
[] padronizar as variáveis dos tests no repository

[] ver com AI tipos de erros genericos que podemos criar e quais outros custom erros para podermos criar
[] ver com a ai como eu posso verificar no getuserbaçance como eu faço para saber se o user tem alguma transaction, eu faço no service ou no repository?
[] mudar o tipo de valor que o userBalance recebe de number para string

[] no meu delete-transaction eu vejo que eu não valido se o id do user passado pode ser um user id inexistente, apenas valido se existe alguma transaction antes de deletar

[] no arquivo http.ts, acho mais válido eu retirar a propriedade "data" das resposatas que provavelmente nunca terao o "data", deixando a resposta mais limpa, e deixando obrigatorio o "data" nas resposata que necessitam do data

[] ver com a ai, se é valido ao atualizar uma transação, a gente receber o userId afim de validar

[] ver com a ai se é válido retornar ""Transaction with id 208a9b50-6736-42d4-a173-cc22b024fbb3 not found", de forma que a gente expecifica o id, quais são as boas práticas? retornar apenas "transaction not found"?

[] implementar midwarre para validações de request. ver se é mais válido isso ou um midware que centraliza o tratamento dos erros (tirando essa responsabilidade do controller e centralizando em apenas um lugar)

---

[] melhorar a tipagem dos meus: httpRequest: HttpRequest, poruqem dessa maneira eu não tenho o auto complite se é body, params ou querys que eu tenho
[] Trocar console.error por logger; incluir requestId/userId no log.

---

## Fase 1: Fundações e Consistência (Baixo Esforço, Alto Impacto)

O foco desta fase é padronizar o código, melhorar a consistência da API e corrigir pequenos problemas que têm um grande impacto na qualidade e na experiência do desenvolvedor.

<!-- TODO: -->
1.  **[ ] Padronizar Variáveis de Testes nos Repositórios**
    - **Tarefa Original**: `padronizar as variáveis dos tests no repository`.
    - **Justificativa**: Manter um padrão de nomenclatura e estrutura nas variáveis de teste (e.g., `sut`, `mockedUser`) torna os testes mais fáceis de ler e manter.

<!-- TODO: -->
2.  **[ ] Melhorar Mensagens de Erro para Entidades Não Encontradas**
    - **Tarefa Original**: `ver com a ai se é válido retornar "Transaction with id {id} not found"`.
    - **Resposta e Justificativa**: Sim, é uma excelente prática. Incluir o ID na mensagem de erro `"{Entidade} with id {id} not found"` ajuda muito na depuração (debugging) do frontend e na análise de logs, pois você sabe exatamente qual registro estava sendo procurado. Recomendo aplicar este padrão para todas as mensagens de "não encontrado".

---

<!-- TODO: -->
4.  **[ ] Implementar Middleware de Tratamento de Erros Centralizado**
    - **Tarefa Original**: `implementar midwarre ... que centraliza o tratamento dos erros`.
    - **Justificativa**: Esta é uma das melhorias mais importantes. Um middleware de erro centralizado (Error Handling Middleware) remove a lógica de `try/catch` dos controllers, limpa o código e garante que todos os erros sejam tratados de forma consistente, retornando respostas HTTP padronizadas.

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

5.  **[ ] Refatorar Classes para Usar Parameter Properties do TypeScript**

- **Tarefa Original**: Simplificar a declaração de propriedades privadas nas classes usando a feature de Parameter Properties do TypeScript.
- **Justificativa**: O TypeScript oferece uma sintaxe mais limpa para criar propriedades privadas e readonly diretamente no constructor, eliminando código boilerplate e seguindo as melhores práticas de Clean Architecture.
- **O que fazer**:
    - Remover declarações de propriedades privadas antes do constructor
    - Adicionar `private readonly` nos parâmetros do constructor
    - Remover linhas de atribuição redundantes dentro do constructor
- **Exemplo de Refatoração**:

    **Antes (Código Verboso)**:

    ```typescript
    export class CreateUserService
        implements Service<CreateUserParams, UserPublicResponse>
    {
        private createUserRepository: CreateUserRepository

        constructor(createUserRepository: CreateUserRepository) {
            this.createUserRepository = createUserRepository
        }
    }
    ```

    **Depois (Código Limpo)**:

    ```typescript
    export class CreateUserService
        implements Service<CreateUserParams, UserPublicResponse>
    {
        constructor(
            private readonly createUserRepository: CreateUserRepository,
        ) {
            // TypeScript automaticamente cria e inicializa a propriedade
        }
    }
    ```

- **Benefícios**:
    - ✅ Menos código boilerplate
    - ✅ Propriedades automaticamente `private` e `readonly`
    - ✅ Melhor encapsulamento e imutabilidade
    - ✅ Código mais limpo e legível
    - ✅ Segue padrões estabelecidos no projeto

---

## Fase 4: Lógica de Negócio e Funcionalidades

Melhorias focadas na lógica de negócio específica da aplicação.

1.  **[ ] Clarificar Lógica de Negócio para `getUserBalance` com Zero Transações**
    - **Tarefa Original**: `ver com a ai como eu posso verificar no getuserbalance como eu faço para saber se o user tem alguma transaction`.
    - **Análise e Sugestão**: Seu repositório já calcula o balanço a partir das transações. Se não há transações, o balanço será zero, o que é o comportamento correto e esperado. A responsabilidade de exibir uma mensagem como "Você ainda não tem transações" é do frontend. O ideal é manter a responsabilidade do repositório de apenas buscar os dados.

---

- 

- [ ] COMO EU POSSO MELHORAR A TIPAGEM DO MEU SERVICE?

Ver se a maioria das minhas interface eu coloco elas uso elas em mais de dois arquivos, se for 1 ou dois apenas, eu mudo a interface para dentro do arquivo original (evitar o overengineer)

- [ ] ver se é válido passar os fixtures em um arquivo separado (que tem o propósito de centralizar a criação deles), ou é mia sválido deixar eles dentro do próprio arquivo





7.  

---

# Ordem do que estou fazendo no momento:

[x] implementar o middlware de error handling

[x] testes no middleware de auth

[] melhorar a tipagem dos meus: httpRequest: HttpRequest, poruqem dessa maneira eu não tenho o auto complite se é body, params ou querys que eu tenho

[] ver com a AI como eu farei com a distribuição das interfaces, quais eu coloco prŕoprio arquivo e quais eu deixo no arquivo de types

[] mudar o arquivo de types para "@types" igual o projeto da rocketseat: https://github.com/rocketseat-education/ignite-nodejs-03-api-solid-nodejs/tree/main/src/%40types

[]  Dentro da rota de login user, preciso validar se os adapter não lançam erros (ver se é valido, é uma task antiga que não sei se faz sentido ainda)

[]  Posso melhorar todos os meu outros adapters afim de tratarem o erro da melhor forma independente de quem chama eles (ver com a AI se é válido, isso gera complexidade e temos que ter em mente de não cair no over engineer)

[] implementar paginação no get transactions (talvez o scroll infinito seja melhor nesse caso para exibir as transações)
  [] fiquei com duvida de como eu faço e utilizo filtros utilizando paginação (entra naquele problema que o gabriel tinha na mamba, a diferença é que a minha paginação talvez seja de cursor (scroll infinito))

[] implementar cache na rota de get transaction (fica a duvida de como fazer isso usando com a rota que tem paginação)

[] ver possibildiade de implementar middleware de rate limiting, ou se faço isso com alguma lib ou metodos nativos do node. Acredito que a algumas rotas apenas possam ter essa necessidade (ver quais com a AI)
  Bom, o que eu achei interessante foram alguns middles como, por exemplo, o de segurança e headers HTTP, pra gente lidar com o hate limiting. Eu acho muito legal a gente utilizar isso porque, por exemplo, alguém que esteja tentando ter uma conta, mas tentar quebrar o nosso servidor, o nosso banco de dados enchendo de requisições, com injeção de Javascript, por exemplo, a gente pode limitar isso. Se diz que dá pra gente fazer com, geralmente, esse tipo de coisa de hate limit, a gente faz com o middler mesmo, no Express, porque eu sei que, por exemplo, quando a gente utiliza algumas ferramentas e etc, a gente consegue, as ferramentas mesmas tem esses benefícios, mas no middler, no Express, a gente lidaria dessa forma, então?


[] Ver de implementar observabilidade com algum software ou como a AI sugeriu com middleware, porem, com middleware pode ser mais complexo snedo que tem softwares que podem facilitar isso (talvez não tenha necssidade de usar mcp de algum software de observailidade porque no final não terá um impacto, sendo que é um projeto para de estudos)
  Bom, você também mencionou de login e requisições, que é para a gente conseguir monitorar de onde veio o método, a URL, status da resposta, tempo de execução, API do cliente e afins. A gente fazendo isso, não seria a mesma coisa que a gente adicionar observabilidade no nosso projeto? Porque isso me gera uma dúvida, porque é uma coisa que eu vou fazer posteriormente e eu não quero ter retrabalho. Se eu adicionando observabilidade, eu já vou ter acesso a todos esses recursos? Então não faz sentido para mim adicionar um meter, entendeu?


[] Melhorar a composição e organização dos meus testes, acredito que estou fazendo over engineer, aplicando várias coisas em todos os testes, sendo que talvez eles não precisem
  [] 1. nos tests, o quye é convencional, crir um stub mais realista, que recebe os params mesmo que não iremos utilizar, ou fazemos do modo mais simples e necessário?

  [] 2. EU sinto que nos meus tests nem sempre é necessário eu ter a estrutura que eu tenho em todos os tasts, tenho que ver melhor o que é necessaŕio, e como usar o beforeEach, beforeEachAll, afterEach, afterEachAll da melhor forma
    [] Será que aplicando direito esses métodos, eu consigo melhorar a questão que quando a gente roda os testes, a gente tem algumas opções. Uma, por exemplo, rodar com o teste container, que é uma biblioteca que a gente consegue a cada teste subir um container, então subir um banco de dados, fazer o teste, matar esse banco de dados e ir para o próximo, de forma que todos os testes podem rodar de forma assíncrona, então ao mesmo tempo, mas com banco de dados diferentes. Ou a gente continua executando da mesma forma que a gente faz, que cada teste ele é executado sequencialmente, então eles não são executados de forma aleatória e ao mesmo tempo, porque a gente faz com que a cada teste ele limpe o banco de dados. Então o teste vai rodar e para o próximo ele tem que esperar o anterior acabar, limpar o banco de dados para ele prosseguir. Mas será que se a gente usar melhor o before all ou after it, ou qualquer que seja, a gente não consiga superar essa necessidade de juntar esses dois mundos, de conseguir rodar tudo ao mesmo tempo, da melhor forma, e a gente tem que ter o banco mais limpo possível. Eu não sei exatamente porque você existe o teste container para superar essa necessidade, é porque deve ter algum empecilho nesse meio do caminho, de não conseguir fazer isso, mas é válido a gente tentar fazer e ver da melhor forma que pode funcionar.
