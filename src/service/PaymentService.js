import Receipt from "../domain/Receipt.js";

class PaymentService {
    constructor(productService, promotionService, discountService) {
        this.productService = productService;
        this.promotionService = promotionService;
        this.discountService = discountService;
    }

    async processPayment(cart, useMembership) {
        const cartItems = cart.getItems();
        const { freeItems, promotionDiscount } = this.discountService.calculatePromotionDiscount(cartItems);
        const totalAmount = cart.calculateTotalAmount();

        const receipt = new Receipt(cartItems, freeItems, totalAmount);
        this.applyDiscounts(receipt, promotionDiscount, useMembership);
        this.updateInventory(cartItems, freeItems);

        return receipt;
    }

    applyDiscounts(receipt, promotionDiscount, useMembership) {
        // 프로모션 할인 적용
        receipt.applyPromotionDiscount(promotionDiscount);

        // 멤버십 할인 적용
        if (useMembership) {
            const membershipDiscount = this.discountService.calculateMembershipDiscount(
                receipt.totalAmount - promotionDiscount
            );
            receipt.applyMembershipDiscount(membershipDiscount);
        }
    }

    updateInventory(cartItems, freeItems) {
        // 구매 상품 재고 감소
        cartItems.forEach(({product, quantity}) => {
            product.reduceStock(quantity);
        });

        // 증정 상품 재고 감소
        freeItems.forEach(({product, quantity}) => {
            product.reduceStock(quantity, true);
        });
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