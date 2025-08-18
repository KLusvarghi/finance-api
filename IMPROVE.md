[] Ver melhor maneira de como melhorar os validators que está em test/fixtures/
[x] implementar as mesmas melhorias nos testes de User
[x] Implementar adapters no nosso service
[] padronizar as variáveis dos tests no repository
[] add soft delete nas tabelas

[] a validação do deleteUserRepostory tem que ser refeita, não só os testes, temos que alterar ele para não retornar null e sim um throw usernotfonunerror, e temos que tratar no teste caso a função user.delete retorne um erro e a caso o repository de um throw

Bom, será que nesse caso eu não consigo reutilizar a criação do usuário? Porque em todos os meus repositores, que estão em user, eu tenho a necessidade de criar um usuário. E provavelmente eu vou ter que replicar a mesma coisa para o transactions. Mas focando só no users, acaba que eu tenho que, para testar um certo comportamento, eu preciso mocar a criação de um usuário. Então eu tenho que criar um usuário, aí depois deletar ou algo do tipo. Será que eu não poderia, por exemplo, no meu fixtures, eu acabar criando uma função, que dentro dessa função a gente cria o usuário e retorna ele. Então ela recebe os parâmetros e retorna o usuário. Será que é válido? Porque eu penso muito na questão de uma chamada no banco, por mais que seja o banco de teste, mas uma chamada no banco, ele acaba sendo feita fora do meu repositor. Então eu fico pensando se é uma boa prática ou não.

[] melhorar a tipagem dos meus: httpRequest: HttpRequest, poruqem dessa maneira eu não tenho o auto complite se é body, params ou querys que eu tenho

---

[x] Arrumar os testes de deleteRepository
[x] criar tesste para getTransactionRepository
[x] Arrumar todos os controllers com a nova ordem de mensagem de erro
[] ver com AI tipos de erros genericos que podemos criar e quais outros custom erros para podermos criar

---

[] ver com a ai como eu posso verificar no getuserbaçance como eu faço para saber se o user tem alguma transaction, eu faço no service ou no repository?
[x] ver o que é mais válido, verificar o result da query dentro d orepository afim de não retoranr null e não precisar tratar no service, ou tratar em ambos, ou tratar só no service?

--

# melhorias da ai

[] Extrair repetição de lógica de validação de ID + existência para decorators/middlewares caso evoluam para framework HTTP real (p. ex. Fastify routes).
[] Trocar console.error por logger; incluir requestId/userId no log.
[X] Usar ESLint rule para proibir imports fora do barrel (@/shared/types, etc.).
[x] Automatizar ordenação de imports.
[x] Considerar criar um tipo genérico Controller<TRequest, TResponse> para unificar assinatura e evitar repetição de execute(HttpRequest): Promise<HttpResponse<…>>.
[x] Considerar criar tipos genéricos para Services (Service<TInput, TOutput>, SimpleService<TInput, TOutput>, etc.) para unificar assinaturas e melhorar type safety.

