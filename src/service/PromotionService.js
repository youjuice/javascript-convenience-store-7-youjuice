import { promises as fs } from 'fs';

class PromotionService {
    constructor() {
        this.promotions = new Map();
    }

    async loadPromotions() {
        try {
            const content = await fs.readFile('public/promotions.md', 'utf-8');
            const lines = content.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('name'));

            for (const line of lines) {
                const [type, quantity] = line.split(',').map(item => item?.trim());

                if (!type || !quantity || isNaN(Number(quantity))) {
                    throw new Error('[ERROR] 잘못된 프로모션 정보 형식입니다.');
                }

                const promotion = {
                    type,
                    requiredQuantity: Number(quantity),
                    freeQuantity: 1,
                    calculateFreeItems(purchaseQuantity) {
                        return Math.floor(purchaseQuantity / this.requiredQuantity);
                    },
                    isApplicable(quantity) {
                        return quantity >= this.requiredQuantity;
                    }
                };

                this.promotions.set(type, promotion);
            }
        } catch (error) {
            if (error.message.includes('[ERROR]')) {
                throw error;
            }
            throw new Error('[ERROR] 프로모션 정보를 불러오는데 실패했습니다.');
        }
    }

    getPromotion(type) {
        return this.promotions.get(type);
    }
}

export default PromotionService;