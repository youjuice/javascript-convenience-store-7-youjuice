import { promises as fs } from 'fs';
import PromotionService from '../../../src/service/PromotionService.js';

jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn()
    }
}));

describe('PromotionService 클래스 테스트', () => {
    let promotionService;

    beforeEach(() => {
        promotionService = new PromotionService();
        jest.clearAllMocks();
    });

    test('프로모션 정보를 정상적으로 로드해야 한다', async () => {
        const mockFileContent = '탄산2+1\n과자1+1\n';
        fs.readFile.mockResolvedValue(mockFileContent);

        await promotionService.loadPromotions();

        const promotion = promotionService.getPromotion('탄산2+1');
        expect(promotion.requiredQuantity).toBe(2);
        expect(promotion.type).toBe('탄산2+1');
    });

    test('잘못된 형식의 프로모션 정보에 대해 에러가 발생해야 한다', async () => {
        const mockFileContent = '잘못된형식의프로모션';
        fs.readFile.mockResolvedValue(mockFileContent);

        await expect(promotionService.loadPromotions()).rejects.toThrow('[ERROR]');
    });

    test('무료 증정 수량이 올바르게 계산되어야 한다', async () => {
        const mockFileContent = '탄산2+1\n';
        fs.readFile.mockResolvedValue(mockFileContent);
        await promotionService.loadPromotions();

        expect(promotionService.calculateFreeItems('탄산2+1', 4)).toBe(2);
        expect(promotionService.calculateFreeItems('존재하지않는프로모션', 4)).toBe(0);
    });
});