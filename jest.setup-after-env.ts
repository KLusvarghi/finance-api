import { prisma } from './prisma/prisma'

// antes de cada teste, deletamos todos os usuários e transações, afim de nenhum dado fique no banco e interfira nos testes
beforeEach(async () => {
    // limpa as tabelas do nosso banco de dados antes de cada teste
    // a ordem importante, pois se deletarmos as transações primeiro, não conseguiremos deletar os usuários, pois eles estão relacionados a transações
    await prisma.transaction.deleteMany({})
    await prisma.user.deleteMany({})
})
