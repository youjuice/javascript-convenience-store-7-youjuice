class Cart {
    constructor() {
        this.items = new Map();
    }

    addItem(product, quantity) {
        this.validateQuantity(quantity);

        if (!product.hasEnoughStock(quantity)) {
            throw new Error('[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.');
        }

        const currentQuantity = this.items.get(product) || 0;
        this.items.set(product, currentQuantity + quantity);
    }

    validateQuantity(quantity) {
        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error('[ERROR] 올바르지 않은 수량입니다.');
        }
    }

    getItems() {
        return Array.from(this.items.entries()).map(([product, quantity]) => ({
            product,
            quantity
        }));
    }

    calculateTotalAmount() {
        return Array.from(this.items.entries()).reduce((total, [product, quantity]) => {
            return total + (product.price * quantity);
        }, 0);
    }

    clear() {
        this.items.clear();
    }

    isEmpty() {
        return this.items.size === 0;
    }
}

export default Cart;