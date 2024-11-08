import Cart from '../../../src/domain/Cart';

describe('Cart 클래스 테스트', () => {
    let cart;
    let mockProduct;

    beforeEach(() => {
        cart = new Cart();
        mockProduct = {
            name: '콜라',
            price: 1000,
            stock: 10,
            hasEnoughStock: jest.fn()
        };
    });

    test('상품을 장바구니에 추가할 수 있어야 한다', () => {
        mockProduct.hasEnoughStock.mockReturnValue(true);
        cart.addItem(mockProduct, 3);

        const items = cart.getItems();
        expect(items).toHaveLength(1);
        expect(items[0].quantity).toBe(3);
        expect(items[0].product).toBe(mockProduct);
    });

    test('재고가 부족한 경우 에러가 발생해야 한다', () => {
        mockProduct.hasEnoughStock.mockReturnValue(false);

        expect(() => cart.addItem(mockProduct, 11))
            .toThrow('[ERROR] 재고 수량을 초과하여 구매할 수 없습니다.');
    });

    test('잘못된 수량으로 상품 추가 시 에러가 발생해야 한다', () => {
        mockProduct.hasEnoughStock.mockReturnValue(true);

        expect(() => cart.addItem(mockProduct, 0))
            .toThrow('[ERROR] 올바르지 않은 수량입니다.');
        expect(() => cart.addItem(mockProduct, -1))
            .toThrow('[ERROR] 올바르지 않은 수량입니다.');
        expect(() => cart.addItem(mockProduct, 1.5))
            .toThrow('[ERROR] 올바르지 않은 수량입니다.');
    });

    test('동일 상품 추가 시 수량이 합산되어야 한다', () => {
        mockProduct.hasEnoughStock.mockReturnValue(true);

        cart.addItem(mockProduct, 3);
        cart.addItem(mockProduct, 2);

        const items = cart.getItems();
        expect(items).toHaveLength(1);
        expect(items[0].quantity).toBe(5);
    });

    test('총 금액이 올바르게 계산되어야 한다', () => {
        mockProduct.hasEnoughStock.mockReturnValue(true);

        cart.addItem(mockProduct, 3);

        const mockProduct2 = {
            ...mockProduct,
            price: 2000,
            hasEnoughStock: jest.fn().mockReturnValue(true)
        };
        cart.addItem(mockProduct2, 2);

        expect(cart.calculateTotalAmount()).toBe(7000);
    });

    test('장바구니를 비울 수 있어야 한다', () => {
        mockProduct.hasEnoughStock.mockReturnValue(true);

        cart.addItem(mockProduct, 3);
        expect(cart.isEmpty()).toBeFalsy();

        cart.clear();
        expect(cart.isEmpty()).toBeTruthy();
    });
});