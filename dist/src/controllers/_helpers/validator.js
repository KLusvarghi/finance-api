import isUUID from 'validator/lib/isUUID';
import { badRequest } from './http';
export const checkIfIdIsValid = (id) => isUUID(id);
export const invalidIdResponse = () => badRequest('The provider id is not valid.');
export const requiredFieldMissingResponse = (missingField) => badRequest(`The field ${missingField} is required.`);
export const handleZodValidationError = (error) => {
    const firstMessage = error.issues?.[0]?.message ?? 'Bad Request';
    return badRequest(firstMessage);
};
//# sourceMappingURL=validator.js.map