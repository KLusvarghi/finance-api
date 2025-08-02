import isUUID from 'validator/lib/isUUID';
import isEmpty from 'validator/lib/isEmpty';
import { badRequest } from './http';
export const checkIfIdIsValid = (id) => isUUID(id);
export const invalidIdResponse = () => badRequest('The provider id is not valid.');
export const checkIfIsString = (value) => typeof value === 'string';
export const validateRequiredFields = (params, requiredFields) => {
    for (const field of requiredFields) {
        const fieldIsMissing = !params[field];
        const fieldIsEmpty = checkIfIsString(params[field]) &&
            isEmpty(params[field], {
                ignore_whitespace: true,
            });
        if (fieldIsMissing || fieldIsEmpty) {
            // o ideal de quand ose cria um função mais genérica, não é que ela retorne um erro, e sim um boolean
            return { ok: false, missingField: field };
        }
    }
    return { ok: true, missingField: undefined };
};
export const requiredFieldMissingResponse = (missingField) => badRequest(`The field ${missingField} is required.`);
