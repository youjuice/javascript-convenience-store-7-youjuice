import Product from '../../../src/domain/Product';

describe('Product 클래스 테스트', () => {
    test('상품 객체가 정상적으로 생성되어야 한다', () => {
        const product = new Product('콜라', 1000, 10, '탄산2+1');

        expect(product.name).toBe('콜라');
        expect(product.price).toBe(1000);
        expect(product.stock).toBe(10);
        expect(product.promotionType).toBe('탄산2+1');
    });

    test('잘못된 상품 정보로 생성 시 에러가 발생해야 한다', () => {
        expect(() => new Product('', 1000, 10)).toThrow('[ERROR]');
        expect(() => new Product('콜라', -1000, 10)).toThrow('[ERROR]');
        expect(() => new Product('콜라', 1000, -1)).toThrow('[ERROR]');
    });

    test('재고 확인이 정상적으로 동작해야 한다', () => {
        const product = new Product('콜라', 1000, 5);
        product.setPromotionStock(5);

        expect(product.hasEnoughStock(8)).toBeTruthy();
        expect(product.hasEnoughStock(11)).toBeFalsy();
    });

    test('재고 감소가 정상적으로 동작해야 한다', () => {
        const product = new Product('콜라', 1000, 5);
        product.setPromotionStock(5);

        product.reduceStock(3, true);
        expect(product.promotionStock).toBe(2);
        expect(product.stock).toBe(5);

        product.reduceStock(4, true);
        expect(product.promotionStock).toBe(0);
        expect(product.stock).toBe(3);
    });

    test('재고 부족 시 에러가 발생해야 한다', () => {
        const product = new Product('콜라', 1000, 5);

        expect(() => product.reduceStock(6)).toThrow('[ERROR]');
    });

    test('재고 정보가 올바르게 표시되어야 한다', () => {
        const product = new Product('콜라', 1000, 0, '탄산2+1');
        expect(product.getStockInfo()).toBe('재고 없음');

        product.setPromotionStock(5);
        expect(product.getStockInfo()).toBe('5개 탄산2+1');
    });
});