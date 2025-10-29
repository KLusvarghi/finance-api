import { Request } from 'express'

export interface RateLimiterPreset {
    points: number
    duration: number
    blockDuration?: number
    keyGenerator: (req: Request) => string
}

export const rateLimiterPresets: Record<string, RateLimiterPreset> = {
    public: {
        // points: Número máximo de requisições permitidas dentro do intervalo de tempo (100 requisições)
        points: 100,
        // duration: Janela de tempo em segundos para o limite de requisições (60 segundos = 1 minuto)
        duration: 60,
        // blockDuration: Tempo em segundos que o cliente ficará bloqueado após exceder o limite (60 segundos)
        blockDuration: 60,
        // keyGenerator: Função que gera a chave única para rate limiting, usando o IP da requisição ou 'unknown' se não disponível
        keyGenerator: (req: Request) => req.ip || 'unknown',
    },
    auth: {
        points: 50,
        duration: 60,
        blockDuration: 300,
        keyGenerator: (req: Request) => {
            const userId = req.user?.id
            return userId ? `user:${userId}` : req.ip || 'unknown'
        },
    },
    strict: {
        points: 5,
        duration: 60,
        blockDuration: 900,
        keyGenerator: (req: Request) => req.ip || 'unknown',
    },
    default: {
        points: 200,
        duration: 60,
        blockDuration: 60,
        keyGenerator: (req: Request) => {
            const userId = req.user?.id
            return userId ? `user:${userId}` : req.ip || 'unknown'
        },
    },
}

export type PresetName = keyof typeof rateLimiterPresets
