import Promotion from '../../../src/domain/Promotion.js';
import { DateTimes } from '@woowacourse/mission-utils';

describe('Promotion 클래스 테스트', () => {
    test('프로모션 객체가 정상적으로 생성되어야 한다', () => {
        const promotion = new Promotion('탄산2+1', 2, new Date('2024-01-01'), new Date('2024-12-31'));

        expect(promotion.type).toBe('탄산2+1');
        expect(promotion.requiredQuantity).toBe(2);
        expect(promotion.freeQuantity).toBe(1);
        expect(promotion.startDate).toEqual(new Date('2024-01-01'));
        expect(promotion.endDate).toEqual(new Date('2024-12-31'));
    });

    test('프로모션 적용 기간 내에만 무료 증정이 가능해야 한다', () => {
        // 프로모션 적용 기간 내
        const promotion = new Promotion('탄산2+1', 2, new Date('2024-01-01'), new Date('2024-12-31'));
        jest.spyOn(DateTimes, 'now').mockReturnValue(new Date('2024-06-15'));
        expect(promotion.calculateFreeItems(4)).toBe(2);

        // 프로모션 적용 기간 외
        const expiredPromotion = new Promotion('탄산2+1', 2, new Date('2024-01-01'), new Date('2024-12-31'));
        jest.spyOn(DateTimes, 'now').mockReturnValue(new Date('2023-12-01'));
        expect(expiredPromotion.calculateFreeItems(4)).toBe(0);
    });

    test('잘못된 프로모션 정보로 생성 시 에러가 발생해야 한다', () => {
        expect(() => new Promotion('', 2, new Date('2023-05-01'), new Date('2023-05-31'))).toThrow('[ERROR]');
        expect(() => new Promotion('탄산2+1', 0, new Date('2023-05-01'), new Date('2023-05-31'))).toThrow('[ERROR]');
        expect(() => new Promotion('탄산2+1', -1, new Date('2023-05-01'), new Date('2023-05-31'))).toThrow('[ERROR]');
    });

    test('프로모션 적용 가능 여부를 올바르게 판단해야 한다', () => {
        const promotion = new Promotion('탄산2+1', 2, new Date('2023-05-01'), new Date('2023-05-31'));
        jest.spyOn(DateTimes, 'now').mockReturnValue(new Date('2023-05-15'));

        expect(promotion.isApplicable(2)).toBeTruthy();
        expect(promotion.isApplicable(1)).toBeFalsy();
    });
});