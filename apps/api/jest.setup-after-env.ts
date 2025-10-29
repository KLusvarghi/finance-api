import { prisma } from './prisma/prisma'

// Mock Redis globally for all tests
// This mock needs to support rate-limiter-flexible library methods
jest.mock('./src/config/redis', () => {
    // In-memory store to simulate Redis behavior for rate limiting
    const store = new Map<string, { value: number; expiresAt: number }>()

    // Helper to clean expired keys
    const cleanExpired = () => {
        const now = Date.now()
        for (const [key, data] of store.entries()) {
            if (data.expiresAt > 0 && data.expiresAt < now) {
                store.delete(key)
            }
        }
    }

    // Create a mock for the multi/pipeline functionality
    interface MockMulti {
        set: jest.Mock<MockMulti, [string, string]>
        pexpire: jest.Mock<MockMulti, [string, number]>
        exec: jest.Mock<Promise<Array<[Error | null, unknown]>>, []>
    }

    const createMockMulti = (): MockMulti => {
        const commands: Array<() => Promise<unknown>> = []

        return {
            set: jest.fn((key: string, value: string): MockMulti => {
                commands.push(async () => {
                    store.set(key, {
                        value: parseInt(value) || 0,
                        expiresAt: 0,
                    })
                    return 'OK'
                })
                return createMockMulti()
            }),
            pexpire: jest.fn((key: string, ms: number): MockMulti => {
                commands.push(async () => {
                    const data = store.get(key)
                    if (data) {
                        data.expiresAt = Date.now() + ms
                    }
                    return 1
                })
                return createMockMulti()
            }),
            exec: jest.fn(async (): Promise<Array<[Error | null, unknown]>> => {
                const results: Array<[Error | null, unknown]> = []
                for (const cmd of commands) {
                    try {
                        const result = await cmd()
                        results.push([null, result])
                    } catch (error) {
                        results.push([error as Error, null])
                    }
                }
                return results
            }),
        }
    }

    return {
        redis: {
            // Basic Redis methods with state
            get: jest.fn(async (key: string) => {
                cleanExpired()
                const data = store.get(key)
                return data ? String(data.value) : null
            }),
            set: jest.fn(async (key: string, value: string) => {
                store.set(key, { value: parseInt(value) || 0, expiresAt: 0 })
                return 'OK'
            }),
            setex: jest.fn(
                async (key: string, seconds: number, value: string) => {
                    store.set(key, {
                        value: parseInt(value) || 0,
                        expiresAt: Date.now() + seconds * 1000,
                    })
                    return 'OK'
                },
            ),
            psetex: jest.fn(async (key: string, ms: number, value: string) => {
                store.set(key, {
                    value: parseInt(value) || 0,
                    expiresAt: Date.now() + ms,
                })
                return 'OK'
            }),
            del: jest.fn(async (...keys: string[]) => {
                let deleted = 0
                for (const key of keys) {
                    if (store.delete(key)) deleted++
                }
                return deleted
            }),
            keys: jest.fn(async (pattern: string) => {
                cleanExpired()
                // Simple pattern matching (only supports * wildcard)
                const regex = new RegExp(
                    '^' + pattern.replace(/\*/g, '.*') + '$',
                )
                return Array.from(store.keys()).filter((key) => regex.test(key))
            }),
            incr: jest.fn(async (key: string) => {
                const data = store.get(key)
                const newValue = (data?.value || 0) + 1
                store.set(key, {
                    value: newValue,
                    expiresAt: data?.expiresAt || 0,
                })
                return newValue
            }),
            decr: jest.fn(async (key: string) => {
                const data = store.get(key)
                const newValue = (data?.value || 0) - 1
                store.set(key, {
                    value: newValue,
                    expiresAt: data?.expiresAt || 0,
                })
                return newValue
            }),
            expire: jest.fn(async (key: string, seconds: number) => {
                const data = store.get(key)
                if (data) {
                    data.expiresAt = Date.now() + seconds * 1000
                    return 1
                }
                return 0
            }),
            pexpire: jest.fn(async (key: string, ms: number) => {
                const data = store.get(key)
                if (data) {
                    data.expiresAt = Date.now() + ms
                    return 1
                }
                return 0
            }),
            ttl: jest.fn(async (key: string) => {
                cleanExpired()
                const data = store.get(key)
                if (!data) return -2
                if (data.expiresAt === 0) return -1
                return Math.ceil((data.expiresAt - Date.now()) / 1000)
            }),
            pttl: jest.fn(async (key: string) => {
                cleanExpired()
                const data = store.get(key)
                if (!data) return -2
                if (data.expiresAt === 0) return -1
                return data.expiresAt - Date.now()
            }),
            // Multi/Pipeline methods for rate-limiter-flexible
            multi: jest.fn(() => createMockMulti()),
            pipeline: jest.fn(() => createMockMulti()),
            // defineCommand allows libraries to register custom Lua scripts
            defineCommand: jest.fn(),
            // Custom commands used by rate-limiter-flexible
            rlflxIncr: jest.fn(async (...args: unknown[]) => {
                // Parse arguments based on Lua script format
                // args[0] is numKeys, args[1] is the key, args[2] is max, args[3] is duration
                const key = args[1] as string
                const max = parseInt(args[2] as string)
                const duration = parseInt(args[3] as string)

                cleanExpired()
                const data = store.get(key)
                const current = data?.value || 0

                // If already at max, reject
                if (current >= max) {
                    const ttl = data?.expiresAt
                        ? Math.max(1, data.expiresAt - Date.now())
                        : duration * 1000
                    return [current, 0, Math.ceil(ttl)]
                }

                // Increment counter
                const newValue = current + 1
                const expiresAt =
                    data?.expiresAt || Date.now() + duration * 1000
                store.set(key, {
                    value: newValue,
                    expiresAt: expiresAt,
                })

                const ttl = Math.max(1, expiresAt - Date.now())
                const remaining = Math.max(0, max - newValue)
                return [newValue, remaining, Math.ceil(ttl)]
            }),
            // Event handlers
            on: jest.fn(),
            once: jest.fn(),
            off: jest.fn(),
            // Helper to clear the store between tests
            flushall: jest.fn(async () => {
                store.clear()
                return 'OK'
            }),
        },
    }
})

// antes de cada teste, deletamos todos os usuários e transações, afim de nenhum dado fique no banco e interfira nos testes
beforeEach(async () => {
    // limpa as tabelas do nosso banco de dados antes de cada teste
    // a ordem importante, pois se deletarmos as transações primeiro, não conseguiremos deletar os usuários, pois eles estão relacionados a transações
    await prisma.transaction.deleteMany({})
    await prisma.user.deleteMany({})

    // Clear Redis mock store between tests to avoid rate limit interference
    const { redis } = await import('./src/config/redis')
    if (redis.flushall) {
        await redis.flushall()
    }
})
