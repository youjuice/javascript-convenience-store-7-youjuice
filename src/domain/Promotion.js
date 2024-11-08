import { validator } from '../utils/validator.js';
import { CONFIG } from '../constants/config.js';

class Promotion {
    constructor(type, requiredQuantity) {
        this.validatePromotionInfo(type, requiredQuantity);
        this.type = type;
        this.requiredQuantity = requiredQuantity;
        this.freeQuantity = CONFIG.PROMOTION.FREE_QUANTITY;
    }

    validatePromotionInfo(type, requiredQuantity) {
        validator.validateString(type, '프로모션 타입');
        validator.validatePositiveNumber(requiredQuantity, '필요 수량');
    }

    calculateFreeItems(quantity) {
        return Math.floor(quantity / this.requiredQuantity);
    }

    isApplicable(quantity) {
        return quantity >= this.requiredQuantity;
    }
}

export default Promotion;