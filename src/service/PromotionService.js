class PromotionService {
    constructor(promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    getPromotion(type) {
        if (!type) return null;
        return this.promotionRepository.findByType(type);
    }

    isPromotionApplicable(product, quantity) {
        const promotion = this.getPromotion(product.promotionType);
        if (!promotion) return false;
        return promotion.isApplicable(quantity);
    }

    calculateFreeQuantity(product, quantity) {
        const promotion = this.getPromotion(product.promotionType);
        if (!promotion) return 0;
        return promotion.calculateFreeItems(quantity);
    }
}

export default PromotionService;