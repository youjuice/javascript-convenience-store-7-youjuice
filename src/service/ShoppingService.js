import Cart from "../domain/Cart.js";
import {validator} from "../utils/validator.js";

class ShoppingService {
    constructor(productService, inputView, outputView, orderService) {
        this.productService = productService;
        this.inputView = inputView;
        this.outputView = outputView;
        this.orderService = orderService;
        this.cart = null;
    }

    async startShopping() {
        this.outputView.printWelcome();
        let continueShopping = true;

        while (continueShopping) {
            this.cart = new Cart();
            this.outputView.printProducts(this.productService.getAllProducts());

            const orderCompleted = await this.handleOrder();
            if (!orderCompleted) break;

            continueShopping = await this.handleAdditionalPurchase();
        }
    }

    async handleAdditionalPurchase() {
        const answer = await this.inputView.readAdditionalPurchase();
        return validator.validateYesNo(answer);
    }

    async handleOrder() {
        const MAX_RETRIES = 3;
        for (let retryCount = 0; retryCount < MAX_RETRIES; retryCount++) {
            const result = await this.tryProcessOrder();
            if (result) return true;
        }
        return false;
    }

    async tryProcessOrder() {
        try {
            await this.orderService.processOrder(this.cart);
            return true;
        } catch (error) {
            this.outputView.printError(error.message);
            this.cart = new Cart();
            return false;
        }
    }
}

export default ShoppingService;