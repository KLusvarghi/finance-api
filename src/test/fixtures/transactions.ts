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

export const invalidDate = [
    {
        description: 'Data em formato string comum',
        date: '25/08/2024',
    },
    {
        description: 'Data em formato americano inválido',
        date: '08/25/2024',
    },
    {
        description: 'Data com formato timestamp inválido',
        date: '1234567890',
    },
    {
        description: 'Data com texto',
        date: 'não é uma data',
    },
    {
        description: 'Data incompleta',
        date: '2024-08',
    },
    {
        description: 'Data com valores impossíveis',
        date: '2024-13-32',
    },
    {
        description: 'Data com caracteres especiais',
        date: '2024/08-25@10:30',
    },
    {
        description: 'Data com formato incorreto de hora',
        date: '2024-08-25 25:61:61',
    },
    {
        description: 'Data vazia',
        date: '',
    },
    {
        description: 'Data com apenas números',
        date: '20240825',
    },
]
