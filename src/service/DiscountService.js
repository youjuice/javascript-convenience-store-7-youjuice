class DiscountService {
    constructor(promotionService, membership) {
        this.promotionService = promotionService;
        this.membership = membership;
    }

    calculatePromotionDiscount(items) {
        const freeItems = this.calculateFreeItems(items);
        const promotionDiscount = freeItems.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        return {
            freeItems,
            promotionDiscount
        };
    }

    calculateFreeItems(items) {
        const freeItems = [];

        items.forEach(({product, quantity}) => {
            if (!product.promotionType) return;

            const promotion = this.promotionService.getPromotion(product.promotionType);
            if (!promotion) return;

            const freeQuantity = promotion.calculateFreeItems(quantity);
            if (freeQuantity > 0) {
                freeItems.push({
                    product,
                    quantity: freeQuantity
                });
            }
        });

        return freeItems;
    }

    calculateMembershipDiscount(amount) {
        return this.membership.calculateDiscount(amount);
    }

    canApplyPromotion(product, quantity) {
        if (!product.promotionType) return false;

        const promotion = this.promotionService.getPromotion(product.promotionType);
        if (!promotion) return false;

        return promotion.isApplicable(quantity);
    }
}

export default DiscountService;