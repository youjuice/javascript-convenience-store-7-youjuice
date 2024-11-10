import { MESSAGES } from '../constants/messages.js';

export const validator = {
    validateNumber(value, fieldName) {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error(MESSAGES.ERROR.NEGATIVE_NUMBER);
        }
    },

    validatePositiveNumber(value, fieldName) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error(MESSAGES.ERROR.ZERO_OR_NEGATIVE);
        }
    },

    validateString(value, fieldName) {
        if (!value || typeof value !== 'string') {
            throw new Error(MESSAGES.ERROR.INVALID_STRING);
        }
    },

    validateYesNo(input) {
        const upperValue = input.toUpperCase();
        if (upperValue !== 'Y' && upperValue !== 'N') {
            throw new Error(MESSAGES.ERROR.INVALID_YES_NO);
        }
        return upperValue === 'Y';
    }
};