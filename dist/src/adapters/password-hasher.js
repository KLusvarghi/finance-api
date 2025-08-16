import bcrypt from 'bcrypt';
export class PasswordHasherAdapter {
    // nesse caso, não precisamos explicitar o async e await já que estamos retornando os valores direto, o TS já entende
    execute(password) {
        return bcrypt.hash(password, 10);
    }
}
//# sourceMappingURL=password-hasher.js.map