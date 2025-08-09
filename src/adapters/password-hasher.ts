import bcrypt from 'bcrypt'

export class PasswordHasherAdapter {
    async execute(password: string): Promise<string> {
        return await bcrypt.hash(password, 10)
    }
}
