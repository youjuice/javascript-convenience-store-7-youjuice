import Receipt from "../domain/Receipt.js";

class PaymentService {
    constructor(productService, promotionService, discountService, inventoryService) {
        this.productService = productService;
        this.promotionService = promotionService;
        this.discountService = discountService;
        this.inventoryService = inventoryService;
    }

    async processPayment(cart, useMembership) {
        const cartItems = cart.getItems();
        const { freeItems, promotionDiscount } = this.discountService.calculatePromotionDiscount(cartItems);
        const totalAmount = cart.calculateTotalAmount();

        const receipt = new Receipt(cartItems, freeItems, totalAmount);
        this.applyDiscounts(receipt, promotionDiscount, useMembership);

        this.inventoryService.updateInventory(cartItems, freeItems);

        return receipt;
    }

    applyDiscounts(receipt, promotionDiscount, useMembership) {
        receipt.applyPromotionDiscount(promotionDiscount);

        if (useMembership) {
            const membershipDiscount = this.discountService.calculateMembershipDiscount(
                receipt.totalAmount - promotionDiscount
            );
            receipt.applyMembershipDiscount(membershipDiscount);
        }
    }

    canApplyPromotion(product, quantity) {
        return this.discountService.canApplyPromotion(product, quantity);
    }

    getRequiredQuantityForPromotion(product) {
        if (!product.promotionType) return null;

        const promotion = this.promotionService.getPromotion(product.promotionType);
        return promotion?.requiredQuantity ?? null;
    }
}

export default PaymentService;