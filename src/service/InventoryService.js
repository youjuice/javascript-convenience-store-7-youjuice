import { MESSAGES } from '../constants/messages.js';

class InventoryService {
    validateStock(product, quantity) {
        if (!product.hasEnoughStock(quantity)) {
            throw new Error(MESSAGES.ERROR.INSUFFICIENT_STOCK);
        }
    }

    updateInventory(cartItems, freeItems) {
        this.updateCartItemsStock(cartItems);
        this.updateFreeItemsStock(freeItems);
    }

    updateCartItemsStock(cartItems) {
        cartItems.forEach(({product, quantity}) => {
            this.validateStock(product, quantity);
            product.reduceStock(quantity);
        });
    }

    updateFreeItemsStock(freeItems) {
        freeItems.forEach(({product, quantity}) => {
            this.validateStock(product, quantity);
            product.reduceStock(quantity, true);
        });
    }

    checkStockAvailability(product, quantity) {
        return product.hasEnoughStock(quantity);
    }
}

export default InventoryService;