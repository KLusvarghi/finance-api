import { IdGeneratorAdapter } from './id-generator'
describe('IdGeneratorAdapter', () => {
    it('should return a random UUID', () => {
        // arrange
        const sut = new IdGeneratorAdapter()
        // act
        const response = sut.execute()
        // assert
        expect(response).toBeTruthy()
        expect(response).toHaveLength(36)
        expect(typeof response).toBe('string')
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        expect(uuidRegex.test(response)).toBe(true)
    })
})
//# sourceMappingURL=id-generator.test.js.map
