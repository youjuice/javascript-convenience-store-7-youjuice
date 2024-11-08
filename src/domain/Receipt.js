class Receipt {
    constructor(cartItems, freeItems, totalAmount) {
        this.items = cartItems;
        this.freeItems = freeItems;
        this.totalAmount = totalAmount;
        this.promotionDiscount = 0;
        this.membershipDiscount = 0;
        this.finalAmount = totalAmount;
        this.totalQuantity = this.calculateTotalQuantity();
    }

    calculateTotalQuantity() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    applyPromotionDiscount(discount) {
        this.validateDiscount(discount);
        this.promotionDiscount = discount;
        this.updateFinalAmount();
    }

    applyMembershipDiscount(discount) {
        this.validateDiscount(discount);
        this.membershipDiscount = discount;
        this.updateFinalAmount();
    }

    validateDiscount(discount) {
        if (!Number.isInteger(discount) || discount < 0) {
            throw new Error('[ERROR] 올바르지 않은 할인 금액입니다.');
        }
    }

    updateFinalAmount() {
        this.finalAmount = this.totalAmount - this.promotionDiscount - this.membershipDiscount;
        if (this.finalAmount < 0) this.finalAmount = 0;
    }

    getFreeItemCount() {
        return this.freeItems.reduce((total, item) => total + item.quantity, 0);
    }
}

export default Receipt;