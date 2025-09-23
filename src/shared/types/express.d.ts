import { User } from './user'

declare global {
    namespace Express {
        interface Request {
            userId?: string
            user?: Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>
        }
    }
}
