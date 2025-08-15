[] Ver melhor maneira de como melhorar os validators que está em test/fixtures/
[x] implementar as mesmas melhorias nos testes de User
[x] Implementar adapters no nosso service
[] padronizar as variáveis dos tests no repository
[] add soft delete nas tabelas

[] a validação do deleteUserRepostory tem que ser refeita, não só os testes, temos que alterar ele para não retornar null e sim um throw usernotfonunerror, e temos que tratar no teste caso a função user.delete retorne um erro e a caso o repository de um throw

Bom, será que nesse caso eu não consigo reutilizar a criação do usuário? Porque em todos os meus repositores, que estão em user, eu tenho a necessidade de criar um usuário. E provavelmente eu vou ter que replicar a mesma coisa para o transactions. Mas focando só no users, acaba que eu tenho que, para testar um certo comportamento, eu preciso mocar a criação de um usuário. Então eu tenho que criar um usuário, aí depois deletar ou algo do tipo. Será que eu não poderia, por exemplo, no meu fixtures, eu acabar criando uma função, que dentro dessa função a gente cria o usuário e retorna ele. Então ela recebe os parâmetros e retorna o usuário. Será que é válido? Porque eu penso muito na questão de uma chamada no banco, por mais que seja o banco de teste, mas uma chamada no banco, ele acaba sendo feita fora do meu repositor. Então eu fico pensando se é uma boa prática ou não.

[] melhorar a tipagem dos meus: httpRequest: HttpRequest, poruqem dessa maneira eu não tenho o auto complite se é body, params ou querys que eu tenho
