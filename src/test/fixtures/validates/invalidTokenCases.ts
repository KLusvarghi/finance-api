export const invalidTokenCases = [
    {
        description: 'token is missing',
        token: undefined,
    },
    {
        description: 'authorization header is empty',
        token: '',
    },
    {
        description: 'authorization header does not contain Bearer prefix',
        token: 'invalid-token-without-bearer',
    },
    {
        description: 'authorization header only contains Bearer',
        token: 'Bearer',
    },
    {
        description:
            'authorization header contains Bearer with space but no token',
        token: 'Bearer ',
    },
    {
        description: 'token is malformed',
        token: 'Bearer malformed.token.here',
    },
    {
        description: 'token has invalid signature',
        token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItaWQiLCJpYXQiOjE2MzQ1NjQ3ODksImV4cCI6MTYzNDU2ODM4OX0.invalid-signature',
    },
    {
        description: 'token is expired',
        // This will be handled by jwt.verify throwing an error
        token: 'Bearer expired-token',
    },
]
