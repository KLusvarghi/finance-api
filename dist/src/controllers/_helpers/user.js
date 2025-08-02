import isEmail from 'validator/lib/isEmail';
import { badRequest, notFound } from './http';
export const invalidPasswordResponse = () => badRequest('Invalid password');
export const emailIsAlreadyInUseResponse = () => badRequest('Invalid e-mail. Please provide a valid one.');
export const userNotFoundResponse = () => notFound('User not found.');
export const userBadRequestResponse = () => notFound('Missing param: userId.');
export const checkIfPasswordIsValid = (password) => password.trim().length >= 6;
export const checkIfEmailIsValid = (email) => isEmail(email);
