import { promises as fs } from 'fs';
import Promotion from '../domain/Promotion.js';
import { parser } from '../utils/parser.js';
import { MESSAGES } from '../constants/messages.js';
import BaseRepository from './BaseRepository.js';

class PromotionRepository extends BaseRepository {
    async loadFromFile(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const lines = content.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('name'));

            await this.processPromotionLines(lines);
        } catch (error) {
            throw new Error(MESSAGES.ERROR.LOAD_PROMOTION_FAIL);
        }
    }

    async processPromotionLines(lines) {
        for (const line of lines) {
            const promotionInfo = parser.parsePromotionInfo(line);
            await this.addPromotion(promotionInfo);
        }
    }

    async addPromotion(promotionInfo) {
        const { type, requiredQuantity } = promotionInfo;
        const promotion = new Promotion(type, requiredQuantity);
        await this.save(type, promotion);
    }

    findByType(type) {
        return this.items.get(type);
    }
}

export default PromotionRepository;