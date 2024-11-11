import Receipt from "../domain/Receipt.js";
import {MESSAGES} from "../constants/messages.js";
import {parser} from "../utils/parser.js";

class OrderService {
    constructor(
        productService,
        promotionService,
        cartService,
        discountService,
        inputView,
        outputView
    ) {
        this.productService = productService;
        this.promotionService = promotionService;
        this.cartService = cartService;
        this.discountService = discountService;
        this.inputView = inputView;
        this.outputView = outputView;
    }

    async processOrder() {
        try {
            const orderItems = await this.getOrderItems();
            await this.processOrderItems(orderItems);

            if (this.cartService.isEmpty()) {
                return null;
            }

            const useMembership = await this.checkMembership();
            const receipt = await this.createReceipt(useMembership);
            await this.updateInventory(receipt);
            this.outputView.printReceipt(receipt);

            return receipt;
        } catch (error) {
            this.outputView.printError(error.message);
            return null;
        } finally {
            this.cartService.clear();
        }
    }

    async getOrderItems() {
        const input = await this.inputView.readItem();
        return parser.parseProductInput(input);
    }

    async processOrderItems(orderItems) {
        for (const { name, quantity } of orderItems) {
            const product = await this.productService.getProduct(name);

            if (!await this.productService.checkStockAvailability(product, quantity)) {
                throw new Error(MESSAGES.ERROR.INSUFFICIENT_STOCK);
            }

            if (this.promotionService.isPromotionApplicable(product, quantity)) {
                await this.handlePromotion(product, quantity);
                continue;
            }

            this.cartService.addItem(product, quantity);
        }
    }

    async handlePromotion(product, quantity) {
        const answer = await this.inputView.readPromotionAdd(product.name);
        if (answer.toUpperCase() === 'Y') {
            if (!await this.productService.checkStockAvailability(product, quantity + 1)) {
                throw new Error(MESSAGES.ERROR.INSUFFICIENT_STOCK);
            }
            this.cartService.addItem(product, quantity + 1);
        } else {
            this.cartService.addItem(product, quantity);
        }
    }

    async checkMembership() {
        const answer = await this.inputView.readMembershipUse();
        return answer.toUpperCase() === 'Y';
    }

    async createReceipt(useMembership) {
        const cartItems = this.cartService.getItems();
        const {
            promotionalDiscount,
            membershipDiscount,
            freeItems
        } = this.discountService.calculateTotalDiscount(cartItems, useMembership);

        return new Receipt(
            cartItems,
            freeItems,
            this.cartService.calculateTotal(),
            promotionalDiscount,
            membershipDiscount
        );
    }

    async updateInventory(receipt) {
        for (const item of receipt.items) {
            await this.productService.updateStock(item.product, item.quantity);
        }

        for (const item of receipt.freeItems) {
            await this.productService.updateStock(item.product, item.quantity, true);
        }
    }
}

export default OrderService;