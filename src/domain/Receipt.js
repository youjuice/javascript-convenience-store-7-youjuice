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
}

export default Receipt;