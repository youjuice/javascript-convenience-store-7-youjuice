import { MESSAGES } from '../constants/messages.js';

export const validator = {
    validateNumber(value, fieldName) {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error(MESSAGES.ERROR.INVALID_QUANTITY);
        }
    },

    validatePositiveNumber(value, fieldName) {
        if (!Number.isInteger(value) || value <= 0) {
            throw new Error(MESSAGES.ERROR.INVALID_QUANTITY);
        }
    },

    validateString(value, fieldName) {
        if (!value || typeof value !== 'string') {
            throw new Error(MESSAGES.ERROR.INVALID_FORMAT);
        }
    },

    validateYesNo(input) {
        const upperValue = input.toUpperCase();
        if (upperValue !== 'Y' && upperValue !== 'N') {
            throw new Error(MESSAGES.ERROR.INVALID_FORMAT);
        }
        return upperValue;
    }
};