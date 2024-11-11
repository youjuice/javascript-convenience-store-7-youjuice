class DiscountService {
    constructor(promotionService, membership) {
        this.promotionService = promotionService;
        this.membership = membership;
    }

    calculateTotalDiscount(cartItems, useMembership) {
        const { promotionalDiscount, freeItems } = this.calculatePromotionalDiscount(cartItems);
        const membershipDiscount = useMembership ?
            this.calculateMembershipDiscount(cartItems, promotionalDiscount) :
            0;

        return {
            promotionalDiscount,
            membershipDiscount,
            freeItems
        };
    }

    calculatePromotionalDiscount(cartItems) {
        const freeItems = [];
        let totalDiscount = 0;

        cartItems.forEach(({product, quantity}) => {
            if (!product.promotionType) return;

            const freeQuantity = this.promotionService.calculateFreeQuantity(product, quantity);
            if (freeQuantity > 0) {
                freeItems.push({
                    product,
                    quantity: freeQuantity
                });
                totalDiscount += product.price * freeQuantity;
            }
        });

        return {
            promotionalDiscount: totalDiscount,
            freeItems
        };
    }

    calculateMembershipDiscount(cartItems, promotionalDiscount) {
        const subtotal = cartItems.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);

        return this.membership.calculateDiscount(subtotal - promotionalDiscount);
    }
}

export default DiscountService;