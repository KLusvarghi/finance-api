import { cache } from './cache'

export interface ITransactionCacheManager {
    invalidate(userId: string): Promise<void>
}

export class RedisTransactionCacheManager implements ITransactionCacheManager {
    async invalidate(userId: string): Promise<void> {
        const cacheKeyPattern = `transactions:user:${userId}:*`

        try {
            await cache.del(cacheKeyPattern)
        } catch (error) {
            console.error('Error invalidating cache:', error)
        }
    }
}
