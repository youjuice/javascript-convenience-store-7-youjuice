import Cart from "../domain/Cart.js";

class ShoppingService {
    constructor(productService, paymentService, inputView, outputView, validationService, orderService) {
        this.productService = productService;
        this.inputView = inputView;
        this.outputView = outputView;
        this.validationService = validationService;
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
        return await this.validationService.validateYesNo(answer);
    }

    async handleOrder() {
        let retryCount = 0;
        const MAX_RETRIES = 3;

        while (retryCount < MAX_RETRIES) {
            try {
                await this.orderService.processOrder(this.cart);
                return true;
            } catch (error) {
                this.outputView.printError(error.message);
                retryCount++;
                if (retryCount === MAX_RETRIES) {
                    return false;
                }
                this.cart = new Cart();
            }
        }
        return false;
    }
}

export default ShoppingService;