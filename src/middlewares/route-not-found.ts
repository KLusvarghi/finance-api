import { Request, Response } from 'express'

import { notFound } from '@/controllers'

/**
 * Devolve 404 em JSON padronizado quando a rota/método não existe.
 * DEVE ser registrado antes do errorHandler.
 */
export const routeNotFound = (req: Request, res: Response): void => {
    const { statusCode, body } = notFound(
        `Cannot ${req.method} ${req.originalUrl}`,
        'ROUTE_NOT_FOUND',
    )

    res.status(statusCode).json(body)
}
