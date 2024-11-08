import { validator } from '../utils/validator.js';

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

    applyPromotionDiscount(discount) {
        validator.validateNumber(discount, '할인 금액');
        this.promotionDiscount = discount;
        this.updateFinalAmount();
    }

    applyMembershipDiscount(discount) {
        validator.validateNumber(discount, '할인 금액');
        this.membershipDiscount = discount;
        this.updateFinalAmount();
    }

    updateFinalAmount() {
        this.finalAmount = Math.max(
            0,
            this.totalAmount - this.promotionDiscount - this.membershipDiscount
        );
    }

    calculateTotalQuantity() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
}

export default Receipt;