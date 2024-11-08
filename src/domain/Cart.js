import { validator } from '../utils/validator.js';
import { MESSAGES } from '../constants/messages.js';

class Cart {
    constructor() {
        this.items = new Map();
    }

    addItem(product, quantity) {
        try {
            validator.validatePositiveNumber(quantity, '수량');
        } catch (error) {
            throw new Error(MESSAGES.ERROR.INVALID_QUANTITY);
        }

        if (!product.hasEnoughStock(quantity)) {
            throw new Error(MESSAGES.ERROR.INSUFFICIENT_STOCK);
        }

        const currentQuantity = this.items.get(product) || 0;
        this.items.set(product, currentQuantity + quantity);
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