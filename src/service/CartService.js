import Cart from "../domain/Cart.js";

class CartService {
    constructor() {
        this.cart = new Cart();
    }

    addItem(product, quantity) {
        this.cart.addItem(product, quantity);
    }

    getItems() {
        return this.cart.getItems();
    }

    calculateTotal() {
        return this.cart.calculateTotalAmount();
    }

    clear() {
        this.cart = new Cart();
    }

    isEmpty() {
        return this.cart.isEmpty();
    }
}

export default CartService;