import { promises as fs } from 'fs';
import { CONFIG } from '../constants/config.js';
import { MESSAGES } from '../constants/messages.js';
import { parser } from '../utils/parser.js';
import Promotion from '../domain/Promotion.js';

class PromotionService {
    constructor() {
        this.promotions = new Map();
    }

    async loadPromotions() {
        try {
            const content = await fs.readFile(CONFIG.FILE.PROMOTIONS, 'utf-8');
            const lines = content.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('name'));

            for (const line of lines) {
                const { type, requiredQuantity } = parser.parsePromotionInfo(line);
                this.promotions.set(type, new Promotion(type, requiredQuantity));
            }
        } catch (error) {
            if (error.message.includes('[ERROR]')) {
                throw error;
            }
            throw new Error(MESSAGES.ERROR.LOAD_PROMOTION_FAIL);
        }
    }

    getPromotion(type) {
        return this.promotions.get(type);
    }
}

export default PromotionService;