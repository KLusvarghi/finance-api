import isCurrency from 'validator/lib/isCurrency';
import { badRequest, notFound } from './http';
export const checkAmoutIsValid = (amount) => {
    if (typeof amount !== 'number')
        return false;
    const amountValid = isCurrency(amount.toFixed(2), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
    });
    if (!amountValid)
        return false;
    return true;
};
export const checkIsTypeValid = (type) => {
    return ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type);
};
export const invalidAmoutResponse = () => {
    return badRequest('The amount is must be a valid currency');
};
export const invalidTypeResponse = () => {
    return badRequest('Transaction type is invalid');
};
export const transactionNotFoundResponse = () => notFound('Transaction not found.');
