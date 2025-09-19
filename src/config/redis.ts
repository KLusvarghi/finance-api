import IORedis from 'ioredis'

const redis = new IORedis(process.env.REDIS_URL as string, {
    maxRetriesPerRequest: null, //  Número máximo de tentativas de reconexão por requisição
    retryStrategy: () => 100, // tempo de espera (em ms) entre tentativas de reconexão
    enableReadyCheck: false, //  Se deve aguardar o Redis estar "pronto" antes de executar comandos
    lazyConnect: true, //  Se deve conectar imediatamente ou apenas quando o primeiro comando for executado
    connectTimeout: 10000, // Timeout de conexão (10s)
    commandTimeout: 5000, // Timeout de comandos (5s)
    maxLoadingRetryTime: 5000, // Timeout máximo de loading
})

redis.on('error', (err) => {
    console.error('Redis connection error:', err)
})

redis.on('connect', () => {
    console.log('Redis connected successfully')
})

export { redis }
