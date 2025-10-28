import { execSync } from 'child_process'

// antes de rodar os testes, iniciamos o container do postgres e executamos o comando para criar as tabelas do nosso banco de dados
export async function init() {
    // iniciamos o container do postgres
    // pode achar estranho de deixar o comando "docker compose" separado, mas isso é para que quando a gente roda o ci cd, a imagem do docker que a gente rodar, sempre seja a versão mais atual (2+) do docker que tem disoonivel na imagem, porue ele pode ter tanto a versão 1 quando a 2 disponivel na imagem, e precisamos da v2
    // https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2204-Readme.md
    execSync('docker compose up -d --wait postgres-test')
    // executamos o comando para criar as tabelas do nosso banco de dados
    execSync('npx prisma db push')
}

export default init
