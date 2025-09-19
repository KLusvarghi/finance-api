import { cache } from './cache'

// Mock the Redis client
jest.mock('../config/redis', () => ({
    redis: {
        set: jest.fn(),
        get: jest.fn(),
        del: jest.fn(),
        keys: jest.fn(),
    },
}))

// Import the mocked redis after mocking
import { redis } from '../config/redis'

const mockedRedis = jest.mocked(redis)

describe('Cache Adapter', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('set', () => {
        it('should set a value in cache with default TTL', async () => {
            const key = 'test:key'
            const value = { id: '123', name: 'test' }

            await cache.set(key, value)

            expect(mockedRedis.set).toHaveBeenCalledWith(
                key,
                JSON.stringify(value),
                'EX',
                300, // 5 minutes in seconds
            )
        })

        it('should set a value in cache with custom TTL', async () => {
            const key = 'test:key'
            const value = { id: '123', name: 'test' }
            const customTTL = 120

            await cache.set(key, value, customTTL)

            expect(mockedRedis.set).toHaveBeenCalledWith(
                key,
                JSON.stringify(value),
                'EX',
                customTTL,
            )
        })

        it('should handle errors gracefully when setting cache', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
            mockedRedis.set.mockRejectedValueOnce(new Error('Redis error'))

            const key = 'test:key'
            const value = { id: '123', name: 'test' }

            await expect(cache.set(key, value)).resolves.not.toThrow()

            expect(consoleSpy).toHaveBeenCalledWith(
                'Error setting cache for key "test:key":',
                expect.any(Error),
            )

            consoleSpy.mockRestore()
        })
    })

    describe('get', () => {
        it('should get a value from cache', async () => {
            const key = 'test:key'
            const value = { id: '123', name: 'test' }
            mockedRedis.get.mockResolvedValueOnce(JSON.stringify(value))

            const result = await cache.get(key)

            expect(mockedRedis.get).toHaveBeenCalledWith(key)
            expect(result).toEqual(value)
        })

        it('should return null when key does not exist', async () => {
            const key = 'test:key'
            mockedRedis.get.mockResolvedValueOnce(null)

            const result = await cache.get(key)

            expect(mockedRedis.get).toHaveBeenCalledWith(key)
            expect(result).toBeNull()
        })

        it('should handle errors gracefully when getting cache', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
            mockedRedis.get.mockRejectedValueOnce(new Error('Redis error'))

            const key = 'test:key'

            const result = await cache.get(key)

            expect(result).toBeNull()
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error getting cache for key "test:key":',
                expect.any(Error),
            )

            consoleSpy.mockRestore()
        })
    })

    describe('del', () => {
        it('should delete a single key', async () => {
            const key = 'test:key'

            await cache.del(key)

            expect(mockedRedis.del).toHaveBeenCalledWith(key)
            expect(mockedRedis.keys).not.toHaveBeenCalled()
        })

        it('should delete multiple keys when pattern is used', async () => {
            const pattern = 'test:*'
            const matchingKeys = ['test:key1', 'test:key2', 'test:key3']
            mockedRedis.keys.mockResolvedValueOnce(matchingKeys)

            await cache.del(pattern)

            expect(mockedRedis.keys).toHaveBeenCalledWith(pattern)
            expect(mockedRedis.del).toHaveBeenCalledWith(...matchingKeys)
        })

        it('should not call del when no keys match pattern', async () => {
            const pattern = 'test:*'
            mockedRedis.keys.mockResolvedValueOnce([])

            await cache.del(pattern)

            expect(mockedRedis.keys).toHaveBeenCalledWith(pattern)
            expect(mockedRedis.del).not.toHaveBeenCalled()
        })

        it('should handle errors gracefully when deleting cache', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
            mockedRedis.del.mockRejectedValueOnce(new Error('Redis error'))

            const key = 'test:key'

            await expect(cache.del(key)).resolves.not.toThrow()

            expect(consoleSpy).toHaveBeenCalledWith(
                'Error deleting cache for key "test:key":',
                expect.any(Error),
            )

            consoleSpy.mockRestore()
        })

        it('should handle errors gracefully when deleting cache with pattern', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
            mockedRedis.keys.mockRejectedValueOnce(new Error('Redis error'))

            const pattern = 'test:*'

            await expect(cache.del(pattern)).resolves.not.toThrow()

            expect(consoleSpy).toHaveBeenCalledWith(
                'Error deleting cache for key "test:*":',
                expect.any(Error),
            )

            consoleSpy.mockRestore()
        })
    })
})
