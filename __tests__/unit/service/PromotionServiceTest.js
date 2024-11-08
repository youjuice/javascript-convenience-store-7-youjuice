import PromotionService from '../../../src/service/PromotionService.js';
import { promises as fs } from 'fs';

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
        const mockFileContent =
            'name,quantity\n' +
            '탄산2+1,2\n' +
            '과자1+1,1\n';

        fs.readFile.mockResolvedValue(mockFileContent);

        await promotionService.loadPromotions();

        const carbonatePromo = promotionService.getPromotion('탄산2+1');
        expect(carbonatePromo.type).toBe('탄산2+1');
        expect(carbonatePromo.requiredQuantity).toBe(2);
        expect(carbonatePromo.freeQuantity).toBe(1);

        const snackPromo = promotionService.getPromotion('과자1+1');
        expect(snackPromo.requiredQuantity).toBe(1);
    });

    test('잘못된 형식의 프로모션 정보에 대해 에러가 발생해야 한다', async () => {
        const mockFileContent = '잘못된,형식의,프로모션';
        fs.readFile.mockResolvedValue(mockFileContent);

        await expect(promotionService.loadPromotions()).rejects.toThrow('[ERROR]');
    });

    test('프로모션 적용 가능 여부를 올바르게 판단해야 한다', async () => {
        const mockFileContent =
            'name,quantity\n' +
            '탄산2+1,2\n';

        fs.readFile.mockResolvedValue(mockFileContent);
        await promotionService.loadPromotions();

        const promotion = promotionService.getPromotion('탄산2+1');
        expect(promotion.isApplicable(2)).toBeTruthy();
        expect(promotion.isApplicable(1)).toBeFalsy();
    });

    test('무료 증정 수량이 올바르게 계산되어야 한다', async () => {
        const mockFileContent =
            'name,quantity\n' +
            '탄산2+1,2\n';

        fs.readFile.mockResolvedValue(mockFileContent);
        await promotionService.loadPromotions();

        const promotion = promotionService.getPromotion('탄산2+1');
        expect(promotion.calculateFreeItems(4)).toBe(2); // 4개 구매 시 2개 무료
        expect(promotion.calculateFreeItems(3)).toBe(1); // 3개 구매 시 1개 무료
        expect(promotion.calculateFreeItems(1)).toBe(0); // 1개 구매 시 0개 무료
    });
});