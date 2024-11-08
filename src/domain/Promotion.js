class Promotion {
    constructor(type, requiredQuantity) {
        this.validatePromotionInfo(type, requiredQuantity);
        this.type = type;
        this.requiredQuantity = requiredQuantity;
        this.freeQuantity = 1;
    }

    validatePromotionInfo(type, requiredQuantity) {
        if (!type || typeof type !== 'string') {
            throw new Error('[ERROR] 프로모션 타입이 올바르지 않습니다.');
        }
        if (!Number.isInteger(requiredQuantity) || requiredQuantity <= 0) {
            throw new Error('[ERROR] 필요 수량이 올바르지 않습니다.');
        }
    }

    calculateFreeItems(quantity) {
        return Math.floor(quantity / this.requiredQuantity);
    }

    isApplicable(quantity) {
        return quantity >= this.requiredQuantity;
    }

    getPromotionName() {
        return `${this.requiredQuantity}+1`;
    }
}

export default Promotion;