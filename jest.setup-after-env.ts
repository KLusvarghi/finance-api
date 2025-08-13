import { prisma } from './prisma/prisma'

// antes de cada teste, deletamos todos os usuários e transações, afim de nenhum dado fique no banco e interfira nos testes
beforeEach(async () => {
  // limpa as tabelas do nosso banco de dados antes de cada teste
    await prisma.user.deleteMany({})
    await prisma.transaction.deleteMany({})
})
