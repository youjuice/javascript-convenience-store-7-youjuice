class ShoppingService {
    constructor(productService, orderService, outputView) {
        this.productService = productService;
        this.orderService = orderService;
        this.outputView = outputView;
    }

    async startShopping() {
        try {
            this.outputView.printWelcome();
            const products = await this.productService.getAllProducts();
            this.outputView.printProducts(products);
            await this.orderService.processOrder();
        } catch (error) {
            this.outputView.printError(error.message);
        }
    }
}

export default ShoppingService;