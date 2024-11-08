class Membership {
    constructor() {
        this.DISCOUNT_RATE = 0.3;  // 30% 할인
        this.MAX_DISCOUNT = 8000;  // 최대 8,000원 할인
    }

    calculateDiscount(amount) {
        if (!this.isValidAmount(amount)) {
            throw new Error('[ERROR] 올바르지 않은 할인 대상 금액입니다.');
        }

        const discountAmount = Math.floor(amount * this.DISCOUNT_RATE);
        return Math.min(discountAmount, this.MAX_DISCOUNT);
    }

    isValidAmount(amount) {
        return Number.isInteger(amount) && amount >= 0;
    }
}

export default Membership;