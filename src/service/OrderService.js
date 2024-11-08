import { parser } from "../utils/parser.js";
import {MESSAGES} from "../constants/messages.js";

class OrderService {
    constructor(productService, paymentService, inputView, outputView, validationService) {
        this.productService = productService;
        this.paymentService = paymentService;
        this.inputView = inputView;
        this.outputView = outputView;
        this.validationService = validationService;
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
            const product = this.productService.getProduct(name);

            if (!product.hasEnoughStock(quantity)) {
                throw new Error(MESSAGES.ERROR.INSUFFICIENT_STOCK);
            }

            if (await this.handlePromotion(cart, product, quantity)) {
                continue;
            }

            cart.addItem(product, quantity);
        }
    }

    async handlePromotion(cart, product, quantity) {
        if (this.paymentService.canApplyPromotion(product, quantity)) {
            const answer = await this.inputView.readPromotionAdd(product.name);
            if (await this.validationService.validateYesNo(answer)) {
                if (!product.hasEnoughStock(quantity + 1)) {
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
        const useMembership = await this.validationService.validateYesNo(membershipAnswer);

        const receipt = await this.paymentService.processPayment(cart, useMembership);
        this.outputView.printReceipt(receipt);
    }
}

export default OrderService;