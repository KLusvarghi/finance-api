import { NextFunction, Request, Response } from 'express'
import { RateLimiterRedis } from 'rate-limiter-flexible'

import { PresetName, rateLimiterPresets } from '../config/rate-limiter-presets'
import { redis } from '../config/redis'
import { logger } from '../shared/logger'

interface RateLimiterRejection {
    msBeforeNext: number
    remainingPoints?: number
    totalHits?: number
    totalHitsNow?: number
}

type RateLimiterError = RateLimiterRejection | Error | unknown

const rateLimiterInstances = new Map<string, RateLimiterRedis>()

/**
 * A função `getRateLimiterInstance` é responsável por fornecer (e reutilizar) instâncias do rate limiter para cada preset de limitação configurado.
 *
 * O que ela faz:
 * - Recebe o nome de um preset de rate limiting (ex: 'default', 'public', etc.).
 * - Verifica se já existe uma instância de `RateLimiterRedis` criada para esse preset no cache local (`rateLimiterInstances`).
 * - Se não existir, cria uma nova instância de `RateLimiterRedis` usando as configurações do preset (quantidade de requisições permitidas, duração, tempo de bloqueio, etc.), e armazena no cache.
 * - Retorna a instância correspondente ao preset solicitado.
 *
 * Importância:
 * - Garante que cada preset de rate limiting utilize sempre a mesma instância de rate limiter, evitando recriações desnecessárias e otimizando o uso de recursos.
 * - Centraliza a lógica de criação e reutilização das instâncias, facilitando manutenção e evitando bugs relacionados a múltiplas instâncias para o mesmo preset.
 * - Essencial para a eficiência e consistência do middleware de rate limiting, principalmente em ambientes com múltiplos presets e alto volume de requisições.
 */
function getRateLimiterInstance(presetName: PresetName): RateLimiterRedis {
    if (!rateLimiterInstances.has(presetName)) {
        const preset = rateLimiterPresets[presetName]
        const instance = new RateLimiterRedis({
            storeClient: redis,
            keyPrefix: `rate_limit:${presetName}`,
            points: preset.points,
            duration: preset.duration,
            blockDuration: preset.blockDuration,
        })
        rateLimiterInstances.set(presetName, instance)
    }
    return rateLimiterInstances.get(presetName)!
}

/**
 * A função `rateLimiter` é um middleware para Express responsável por limitar a quantidade de requisições que um cliente pode fazer em um determinado intervalo de tempo, de acordo com um preset de configuração.
 *
 * Explicação detalhada do que a função faz e o que é executado em cada linha:
 *
 * @param presetName - O nome do preset de limitação de taxa a ser utilizado (ex: 'default', 'public', etc.).
 * @returns Uma função middleware assíncrona que será executada a cada requisição.
 */
export function rateLimiter(presetName: PresetName) {
    // Retorna o middleware propriamente dito, que recebe os objetos da requisição, resposta e o next do Express.
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Obtém as configurações do preset de rate limiting correspondente ao nome informado.
            const preset = rateLimiterPresets[presetName]
            // Obtém (ou cria, se necessário) a instância do rate limiter para esse preset.
            const rateLimiterInstance = getRateLimiterInstance(presetName)
            // Gera a chave única para identificar o cliente (pode ser por IP, usuário, etc.), usando a função definida no preset.
            const key = preset.keyGenerator(req)
            // Verifica se o modo "shadow" está ativado (apenas monitora, não bloqueia de fato).
            const shadowMode = process.env.RATE_LIMITER_SHADOW_MODE === 'true'

            try {
                // Tenta consumir 1 ponto do rate limiter para a chave gerada.
                // Se ainda houver pontos disponíveis, a requisição pode prosseguir normalmente.
                const result = await rateLimiterInstance.consume(key)

                // Define os cabeçalhos HTTP padrão conforme RFC 6585 e draft IETF HTTP Rate Limit Headers
                // https://tools.ietf.org/id/draft-polli-ratelimit-headers-00.html
                res.setHeader('RateLimit-Limit', preset.points)
                res.setHeader('RateLimit-Remaining', result.remainingPoints)
                res.setHeader(
                    'RateLimit-Reset',
                    new Date(Date.now() + result.msBeforeNext).toISOString(),
                )

                // Chama o próximo middleware ou rota, permitindo que a requisição continue.
                next()
            } catch (rejRes: RateLimiterError) {
                // Check if this is a rate limit rejection (has msBeforeNext) or an infrastructure error
                if (
                    rejRes &&
                    typeof (rejRes as RateLimiterRejection).msBeforeNext ===
                        'number'
                ) {
                    // Caso o cliente tenha excedido o limite de requisições, cai neste bloco.
                    // Calcula em quantos segundos o cliente poderá tentar novamente.
                    const rejection = rejRes as RateLimiterRejection
                    const retryAfter =
                        Math.round(rejection.msBeforeNext / 1000) || 1

                    // Define os cabeçalhos HTTP padrão conforme RFC 6585 e draft IETF HTTP Rate Limit Headers
                    res.setHeader('RateLimit-Limit', preset.points)
                    res.setHeader('RateLimit-Remaining', 0)
                    res.setHeader(
                        'RateLimit-Reset',
                        new Date(
                            Date.now() + rejection.msBeforeNext,
                        ).toISOString(),
                    )
                    // Header Retry-After conforme RFC 7231 - indica quando tentar novamente (em segundos)
                    res.setHeader('Retry-After', retryAfter)

                    if (shadowMode) {
                        // Se o modo shadow está ativado, apenas loga o excesso de requisições, mas permite que a requisição prossiga normalmente.
                        logger.warn(
                            `Rate limit exceeded for key: ${key}, preset: ${presetName}`,
                            {
                                key,
                                preset: presetName,
                                ip: req.ip,
                                userAgent: req.get('User-Agent'),
                                retryAfter,
                                shadowMode: true,
                            },
                        )
                        // Chama o próximo middleware, não bloqueando a requisição.
                        next()
                    } else {
                        // Se não está em modo shadow, bloqueia a requisição retornando status 429 (Too Many Requests) e uma mensagem de erro.
                        res.status(429).json({
                            error: 'Too Many Requests',
                            message:
                                'Rate limit exceeded. Please try again later.',
                            retryAfter,
                        })
                    }
                } else {
                    // This is an infrastructure error, rethrow to be handled by outer catch
                    throw rejRes
                }
            }
        } catch (error) {
            // Caso ocorra algum erro inesperado na configuração ou execução do rate limiter
            logger.error('Rate limiter error', {
                preset: presetName,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            })

            // Re-check shadow mode in catch block
            const errorShadowMode =
                process.env.RATE_LIMITER_SHADOW_MODE === 'true'
            if (errorShadowMode) {
                // Em modo shadow, apenas loga o erro e permite que a requisição continue
                logger.warn(
                    'Rate limiter infrastructure error in shadow mode',
                    {
                        preset: presetName,
                        ip: req.ip,
                        userAgent: req.get('User-Agent'),
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Unknown error',
                        shadowMode: true,
                    },
                )
                next()
            } else {
                // Em modo produção, falha de forma segura retornando 503
                // Isso evita bypass silencioso do rate limiting quando Redis está indisponível
                res.status(503).json({
                    error: 'Service Temporarily Unavailable',
                    message:
                        'Rate limiting service is temporarily unavailable. Please try again later.',
                })
            }
        }
    }
}
