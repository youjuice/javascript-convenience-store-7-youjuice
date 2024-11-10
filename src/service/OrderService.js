import { parser } from "../utils/parser.js";
import { MESSAGES } from "../constants/messages.js";
import {validator} from "../utils/validator.js";

class OrderService {
    constructor(productService, paymentService, inputView, outputView, inventoryService) {
        this.productService = productService;
        this.paymentService = paymentService;
        this.inputView = inputView;
        this.outputView = outputView;
        this.inventoryService = inventoryService;
    }

    async processOrder(cart) {
        const items = await this.getOrderItems();
        await this.processOrderItems(cart, items);
        await this.completePurchase(cart);
    }

    async getOrderItems() {
        const input = await this.inputView.readItem();
        return parser.parseProductInput(input);
    }

    async processOrderItems(cart, items) {
        for (const {name, quantity} of items) {
            await this.processOneItem(cart, name, quantity);
        }
    }

    async processOneItem(cart, name, quantity) {
        const product = this.productService.getProduct(name);

        if (!this.inventoryService.checkStockAvailability(product, quantity)) {
            throw new Error(MESSAGES.ERROR.INSUFFICIENT_STOCK);
        }

        if (await this.handlePromotion(cart, product, quantity)) {
            return;
        }

        cart.addItem(product, quantity);
    }

    async handlePromotion(cart, product, quantity) {
        if (this.paymentService.canApplyPromotion(product, quantity)) {
            const answer = await this.inputView.readPromotionAdd(product.name);
            if (validator.validateYesNo(answer)) {
                if (!this.inventoryService.checkStockAvailability(product, quantity + 1)) {
                    throw new Error(MESSAGES.ERROR.INSUFFICIENT_STOCK);
                }
                cart.addItem(product, quantity + 1);
                return true;
            }
        }
        return false;
    }

    async completePurchase(cart) {
        const membershipAnswer = await this.inputView.readMembershipUse();
        const useMembership = validator.validateYesNo(membershipAnswer);
        const receipt = await this.paymentService.processPayment(cart, useMembership);
        this.outputView.printReceipt(receipt);
    }
}

export default OrderService;