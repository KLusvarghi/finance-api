import { cache } from './cache'
import { RedisTransactionCacheManager } from './transaction-cache-manager'

jest.mock('./cache')

const mockCache = cache as jest.Mocked<typeof cache>

describe('RedisTransactionCacheManager', () => {
    let sut: RedisTransactionCacheManager

    beforeEach(() => {
        sut = new RedisTransactionCacheManager()
        jest.clearAllMocks()
    })

    describe('invalidate', () => {
        it('should call cache.del with correct pattern', async () => {
            const userId = 'user-123'

            await sut.invalidate(userId)

            expect(mockCache.del).toHaveBeenCalledWith(
                `transactions:user:${userId}:*`,
            )
        })

        it('should handle cache errors gracefully', async () => {
            const userId = 'user-123'
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation()
            const error = new Error('Redis error')
            mockCache.del.mockRejectedValueOnce(error)

            await expect(sut.invalidate(userId)).resolves.not.toThrow()

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Error invalidating cache:',
                error,
            )
            consoleErrorSpy.mockRestore()
        })
    })
})
