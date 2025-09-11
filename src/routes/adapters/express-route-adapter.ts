import { NextFunction, Request, Response } from 'express'

import { HttpRequest } from '@/shared'

/**
 * Generic controller interface for the route adapter.
 * This allows the adapter to work with any controller type.
 */
interface GenericController {
    execute(
        httpRequest: HttpRequest,
    ): Promise<{ statusCode: number; body: unknown }>
}

/**
 * Route adapter that connects Express.js routes to our custom controllers.
 *
 * This adapter:
 * 1. Converts Express Request to our HttpRequest format
 * 2. Executes the controller
 * 3. Sends the response back to Express
 * 4. Passes any errors to the error handling middleware via next()
 *
 * @param controller - The controller instance to execute
 * @returns Express middleware function
 */
export const adaptRoute = (controller: GenericController) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            // Convert Express request to our HttpRequest format
            const httpRequest: HttpRequest = {
                body: req.body,
                params: req.params,
                query: req.query,
                headers: {
                    ...req.headers,
                    userId: (req as unknown as { userId: string }).userId, // Set by auth middleware
                },
                userId: (req as unknown as { userId: string }).userId, // Set by auth middleware
            }

            // Execute the controller
            const httpResponse = await controller.execute(httpRequest)

            // Send response back to Express
            res.status(httpResponse.statusCode).json(httpResponse.body)
        } catch (error) {
            // Pass any errors to the error handling middleware
            next(error)
        }
    }
}
