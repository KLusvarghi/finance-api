// src/middlewares/validate.ts
import { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'

import { handleZodValidationError } from '../controllers/_helpers'

// Esta é uma "fábrica": uma função que retorna outra função (o middleware)
export const validate =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (schema: z.ZodObject<Record<string, any>>) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                // Valida o body, params e query da requisição de uma vez
                await schema.parseAsync({
                    body: req.body,
                    params: req.params,
                    query: req.query,
                })
                return next() // Se a validação passar, continua
            } catch (error) {
                if (error instanceof ZodError) {
                    const response = handleZodValidationError(error)
                    return res.status(response.statusCode).json(response.body)
                }
                // Para outros tipos de erro, envia para o handler de erro geral
                return next(error)
            }
        }
