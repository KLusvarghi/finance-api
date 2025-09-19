---
id: 2025-09-17-implements-cache
titulo: 'feat: Implementar Cache com Redis para Transações'
tipo: feat
execucao_automatica: true
status: completed
---

### 1. Objetivo

Otimizar a rota `GET /transactions/me` implementando um sistema de cache com Redis. A estratégia será "cache-aside": o cache é populado sob demanda e invalidado proativamente em operações de escrita (criação, atualização, exclusão).

### 2. Plano de Execução

#### 2.1. Configuração do Ambiente de Desenvolvimento

1.  **Iniciar os Serviços:** Garanta que os containers Docker estejam em execução.

    ```bash
    docker-compose up -d
    ```

2.  **Configurar Variáveis de Ambiente:** Crie o arquivo `.env` a partir do exemplo, se ele não existir.

    ```bash
    cp -n .env.example .env
    ```

3.  **Verificar a URL do Redis:** Confirme que a linha a seguir existe e está correta no seu arquivo `.env`.
    ```env
    REDIS_URL=redis://localhost:6379
    ```

#### 2.2. Passos de Implementação no Código

**Passo 1: Instalar a biblioteca cliente do Redis**

Adicione `ioredis` como uma dependência de produção.

```bash
pnpm add ioredis
```

Adicione o types de `ioredis` como uma dependência de dev.

```bash
pnpm add @types/ioredis -D
```

**Passo 2: Configurar o cliente Redis**

Crie o arquivo `src/config/redis.ts` para inicializar e exportar a instância do cliente Redis.

```bash
touch src/config/redis.ts
```

Adicione o seguinte conteúdo ao arquivo `src/config/redis.ts`:

```typescript
import IORedis from 'ioredis'

const redis = new IORedis(process.env.REDIS_URL as string, {
    maxRetriesPerRequest: null, // Não tentar reconectar em caso de falha
})

redis.on('error', (err) => {
    console.error('Redis connection error:', err)
})

export { redis }
```

**Passo 3: Criar um adaptador de cache**

Crie o arquivo `src/adapters/cache.ts` para encapsular a lógica do Redis.

```bash
touch src/adapters/cache.ts
```

Adicione o seguinte conteúdo ao arquivo `src/adapters/cache.ts`:

```typescript
import { redis } from '../config/redis'

const DEFAULT_TTL_IN_SECONDS = 60 * 5 // 5 minutos

async function set<T>(key: string, value: T, ttl = DEFAULT_TTL_IN_SECONDS) {
    try {
        await redis.set(key, JSON.stringify(value), 'EX', ttl)
    } catch (error) {
        console.error(`Error setting cache for key "${key}":`, error)
    }
}

async function get<T>(key: string): Promise<T | null> {
    try {
        const data = await redis.get(key)
        return data ? (JSON.parse(data) as T) : null
    } catch (error) {
        console.error(`Error getting cache for key "${key}":`, error)
        return null
    }
}

async function del(key: string) {
    try {
        await redis.del(key)
    } catch (error) {
        console.error(`Error deleting cache for key "${key}":`, error)
    }
}

export const cache = { set, get, del }
```

**Passo 4: Integrar o cache na leitura de transações**

Modifique o `GetTransactionsByUserIdController` para consultar o cache antes de acessar o banco de dados.

- **Arquivo:** `src/controllers/transactions/get-transactions-by-user-id.ts`
- **Lógica:**
    1.  Gere uma chave de cache única baseada no `userId` e nos parâmetros de query (filtros, paginação).
    2.  Tente buscar os dados do cache usando `cache.get(cacheKey)`.
    3.  Se encontrar, retorne os dados do cache.
    4.  Se não encontrar, busque os dados do serviço (`getTransactionsByUserIdService.execute`).
    5.  Armazene o resultado no cache usando `cache.set(cacheKey, result)`.
    6.  Retorne o resultado.

**Passo 5: Implementar invalidação de cache**

Modifique os controladores de escrita para invalidar o cache do usuário correspondente após uma operação bem-sucedida. A chave de cache a ser invalidada deve ser baseada no `userId`.

- **Arquivos a modificar:**
    - `src/controllers/transactions/create-transaction.ts`
    - `src/controllers/transactions/update-transaction.ts`
    - `src/controllers/transactions/delete-transaction.ts`
- **Lógica:** Após a execução bem-sucedida do serviço correspondente, chame `cache.del(cacheKey)` usando a chave associada ao `userId`.

**Passo 6: Adicionar testes para o adaptador de cache**

Crie um arquivo de teste para o adaptador de cache para garantir que ele interage corretamente com o cliente Redis (mockado).

```bash
touch src/adapters/cache.test.ts
```

- **Arquivo:** `src/adapters/cache.test.ts`
- **Lógica:**
    - Use `jest.mock` para mockar o cliente `ioredis`.
    - Escreva testes para as funções `get`, `set` e `del`, verificando se os métodos correspondentes do cliente Redis mockado são chamados com os parâmetros corretos.
    - Teste o tratamento de erros (quando o Redis mockado joga uma exceção).

**Passo 7: Atualizar testes dos controladores**

Adapte os testes de unidade dos controladores de transação para mockar o `cache` e validar a nova lógica.

- **Arquivos:** Testes existentes em `src/controllers/transactions/`
- **Lógica:**
    - Mock o módulo `src/adapters/cache.ts`.
    - No teste do `GetTransactionsByUserIdController`, simule um "cache hit" e um "cache miss" para garantir que o serviço só é chamado quando necessário.
    - Nos testes dos controladores de escrita, verifique se `cache.del` é chamado após uma operação bem-sucedida.

### 3. Arquivos-Alvo

- `package.json`
- `.env`
- `docker-compose.yml`
- `src/config/redis.ts` (novo)
- `src/adapters/cache.ts` (novo)
- `src/adapters/cache.test.ts` (novo)
- `src/controllers/transactions/get-transactions-by-user-id.ts`
- `src/controllers/transactions/create-transaction.ts`
- `src/controllers/transactions/update-transaction.ts`
- `src/controllers/transactions/delete-transaction.ts`
- Testes de unidade e E2E relacionados.

### 4. Critérios de Aceite

- [ ] A rota `GET /transactions/me` retorna dados do cache em requisições subsequentes (cache hit).
- [ ] Operações de `POST`, `PATCH`, `DELETE` em transações invalidam o cache do usuário.
- [ ] A aplicação continua funcionando se o Redis estiver indisponível (fallback para o DB).
- [ ] O comando `pnpm test` é executado com sucesso.
- [ ] O comando `pnpm eslint:check` é executado com sucesso.
- [ ] O comando `pnpm prettier:check` é executado com sucesso.
- [ ] Nenhum tipo `any` foi introduzido no código.

### 5. Riscos & Plano de Rollback

- **Risco:** Bugs na lógica de invalidação podem servir dados desatualizados.
- **Rollback:** Reverter os commits relacionados à feature de cache.
