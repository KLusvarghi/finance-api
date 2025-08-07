export const invalidUUID = [
    {
        description: 'UUID muito longo',
        id: '12345678-1234-1234-1234-123456789012',
    },
    {
        description: 'UUID muito curto',
        id: '12345678-1234-1234-1234-12345678901',
    },
    {
        description: 'UUID com caracteres inválidos',
        id: '12345678-1234-1234-1234-12345678901g',
    },
    {
        description: 'UUID sem hífens',
        id: '12345678-1234-1234-1234-12345678901',
    },
    {
        description: 'UUID com formato completamente inválido',
        id: 'not-a-uuid-at-all',
    },
]
