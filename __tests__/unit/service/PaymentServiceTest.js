import PaymentService from '../../../src/service/PaymentService.js';

describe('PaymentService 클래스 테스트', () => {
    let paymentService;
    let mockProductService;
    let mockPromotionService;
    let mockDiscountService;
    let mockCart;
    let mockProduct;

    beforeEach(() => {
        mockProduct = {
            name: '콜라',
            price: 1000,
            promotionType: '탄산2+1',
            reduceStock: jest.fn()
        };

        mockProductService = {
            getProduct: jest.fn()
        };

        mockPromotionService = {
            getPromotion: jest.fn().mockReturnValue({ requiredQuantity: 2 })
        };

        mockDiscountService = {
            calculatePromotionDiscount: jest.fn().mockReturnValue({
                freeItems: [{ product: mockProduct, quantity: 1 }],
                promotionDiscount: 1000
            }),
            calculateMembershipDiscount: jest.fn().mockReturnValue(600),
            canApplyPromotion: jest.fn()
        };

        mockCart = {
            getItems: jest.fn().mockReturnValue([
                { product: mockProduct, quantity: 3 }
            ]),
            calculateTotalAmount: jest.fn().mockReturnValue(3000)
        };

        paymentService = new PaymentService(
            mockProductService,
            mockPromotionService,
            mockDiscountService
        );
    });

    test('결제가 정상적으로 처리되어야 한다', async () => {
        const receipt = await paymentService.processPayment(mockCart, false);

        expect(receipt.totalAmount).toBe(3000);
        expect(receipt.promotionDiscount).toBe(1000);
        expect(receipt.items).toHaveLength(1);
        expect(mockProduct.reduceStock).toHaveBeenCalled();
    });

    test('멤버십 할인이 적용된 결제가 처리되어야 한다', async () => {
        const receipt = await paymentService.processPayment(mockCart, true);

        expect(receipt.membershipDiscount).toBe(600);
        expect(mockDiscountService.calculateMembershipDiscount)
            .toHaveBeenCalledWith(2000);
    });

    test('재고가 정상적으로 차감되어야 한다', async () => {
        await paymentService.processPayment(mockCart, false);

        expect(mockProduct.reduceStock).toHaveBeenCalledWith(3); // 구매 수량
        expect(mockProduct.reduceStock).toHaveBeenCalledWith(1, true); // 증정 수량
    });

    test('프로모션 적용 가능 여부를 확인할 수 있어야 한다', () => {
        mockDiscountService.canApplyPromotion.mockReturnValue(true);

        expect(paymentService.canApplyPromotion(mockProduct, 2)).toBeTruthy();
        expect(mockDiscountService.canApplyPromotion).toHaveBeenCalledWith(mockProduct, 2);
    });

    test('프로모션에 필요한 수량을 확인할 수 있어야 한다', () => {
        const requiredQuantity = paymentService.getRequiredQuantityForPromotion(mockProduct);
        expect(requiredQuantity).toBe(2);
    });
});