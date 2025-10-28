import { redis } from '../config/redis'

const DEFAULT_TTL_IN_SECONDS = 60 * 5 // 5 minutes

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
        // Se a chave contiver '*', trate-a como um padrão e procure por chaves correspondentes
        if (key.includes('*')) {
            const keys = await redis.keys(key)
            if (keys.length > 0) {
                await redis.del(...keys)
            }
        } else {
            await redis.del(key)
        }
    } catch (error) {
        console.error(`Error deleting cache for key "${key}":`, error)
    }
}

export const cache = { set, get, del }
