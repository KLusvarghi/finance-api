import { execSync } from "child_process";

// antes de rodar os testes, iniciamos o container do postgres e executamos o comando para criar as tabelas do nosso banco de dados
export async function init() {
  // iniciamos o container do postgres
  execSync('docker compose up -d --wait postgres-test')
  // executamos o comando para criar as tabelas do nosso banco de dados
  execSync('npx prisma db push')
}

export default init
