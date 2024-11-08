import { CONFIG } from '../constants/config.js';
import { validator } from '../utils/validator.js';
import { MESSAGES } from '../constants/messages.js';

class Membership {
    constructor() {
        this.DISCOUNT_RATE = CONFIG.MEMBERSHIP.DISCOUNT_RATE;
        this.MAX_DISCOUNT = CONFIG.MEMBERSHIP.MAX_DISCOUNT;
    }

    calculateDiscount(amount) {
        try {
            validator.validateNumber(amount, '할인 대상 금액');
            const discountAmount = Math.floor(amount * this.DISCOUNT_RATE);
            return Math.min(discountAmount, this.MAX_DISCOUNT);
        } catch (error) {
            throw new Error(MESSAGES.ERROR.INVALID_DISCOUNT);
        }
    }
}

export default Membership;