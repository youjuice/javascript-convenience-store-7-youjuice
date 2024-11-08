import { promises as fs } from 'fs';
import Promotion from '../domain/Promotion.js';

class PromotionService {
    constructor() {
        this.promotions = new Map();
    }

    async loadPromotions() {
        try {
            const content = await fs.readFile('public/promotions.md', 'utf8');
            const lines = content.split('\n').filter(line => line.trim());

            lines.forEach(line => {
                const [type, quantity] = this.parsePromotionLine(line);
                const promotion = new Promotion(type, Number(quantity));
                this.promotions.set(type, promotion);
            });
        } catch (error) {
            throw new Error('[ERROR] 프로모션 정보를 불러오는데 실패했습니다.');
        }
    }

    parsePromotionLine(line) {
        const match = line.match(/^(.+?)(\d+)\+1$/);
        if (!match) {
            throw new Error('[ERROR] 프로모션 정보 형식이 올바르지 않습니다.');
        }
        return [match[1] + match[2] + '+1', Number(match[2])];
    }

    getPromotion(type) {
        return this.promotions.get(type);
    }

    calculateFreeItems(promotionType, quantity) {
        const promotion = this.getPromotion(promotionType);
        if (!promotion) return 0;
        return promotion.calculateFreeItems(quantity);
    }
}

export default PromotionService;