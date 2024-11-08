import Promotion from '../../../src/domain/Promotion.js';

describe('Promotion 클래스 테스트', () => {
    test('프로모션 객체가 정상적으로 생성되어야 한다', () => {
        const promotion = new Promotion('탄산2+1', 2);

        expect(promotion.type).toBe('탄산2+1');
        expect(promotion.requiredQuantity).toBe(2);
        expect(promotion.freeQuantity).toBe(1);
    });

    test('잘못된 프로모션 정보로 생성 시 에러가 발생해야 한다', () => {
        expect(() => new Promotion('', 2)).toThrow('[ERROR]');
        expect(() => new Promotion('탄산2+1', 0)).toThrow('[ERROR]');
        expect(() => new Promotion('탄산2+1', -1)).toThrow('[ERROR]');
    });

    test('무료 증정 수량이 올바르게 계산되어야 한다', () => {
        const promotion = new Promotion('탄산2+1', 2);

        expect(promotion.calculateFreeItems(4)).toBe(2); // 4개 구매 시 2개 무료
        expect(promotion.calculateFreeItems(3)).toBe(1); // 3개 구매 시 1개 무료
        expect(promotion.calculateFreeItems(1)).toBe(0); // 1개 구매 시 0개 무료
    });

    test('프로모션 적용 가능 여부를 올바르게 판단해야 한다', () => {
        const promotion = new Promotion('탄산2+1', 2);

        expect(promotion.isApplicable(2)).toBeTruthy();
        expect(promotion.isApplicable(1)).toBeFalsy();
    });
});