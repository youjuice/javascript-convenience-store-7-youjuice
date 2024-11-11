import { validator } from '../utils/validator.js';
import { CONFIG } from '../constants/config.js';
import { DateTimes } from '@woowacourse/mission-utils';

class Promotion {
    constructor(type, requiredQuantity, startDate, endDate) {
        this.validatePromotionInfo(type, requiredQuantity);
        this.type = type;
        this.requiredQuantity = requiredQuantity;
        this.freeQuantity = CONFIG.PROMOTION.FREE_QUANTITY;
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
    }

    validatePromotionInfo(type, requiredQuantity) {
        validator.validateString(type, '프로모션 타입');
        validator.validatePositiveNumber(requiredQuantity, '필요 수량');
    }

    isValid() {
        const now = DateTimes.now();
        return now >= this.startDate && now <= this.endDate;
    }

    calculateFreeItems(quantity) {
        if (!this.isValid()) return 0;
        return Math.floor(quantity / this.requiredQuantity);
    }

    isApplicable(quantity) {
        return quantity >= this.requiredQuantity;
    }
}

export default Promotion;