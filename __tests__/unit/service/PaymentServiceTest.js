import PaymentService from '../../../src/service/PaymentService.js';

describe('PaymentService 클래스 테스트', () => {
    let paymentService;
    let mockProductService;
    let mockPromotionService;
    let mockDiscountService;
    let mockInventoryService;
    let mockCart;
    let mockProduct;

    beforeEach(() => {
        mockProduct = {
            name: '콜라',
            price: 1000,
            promotionType: '탄산2+1',
            reduceStock: jest.fn(),
            hasEnoughStock: jest.fn().mockReturnValue(true)
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

        mockInventoryService = {
            updateInventory: jest.fn(),
            validateStock: jest.fn(),
            checkStockAvailability: jest.fn().mockReturnValue(true),
            updateCartItemsStock: jest.fn(),
            updateFreeItemsStock: jest.fn()
        };

        mockCart = {
            getItems: jest.fn().mockReturnValue([
                { product: mockProduct, quantity: 3 }
            ]),
            calculateTotalAmount: jest.fn().mockReturnValue(3000)
        };

        paymentService = new PaymentService(
            mockPromotionService,
            mockDiscountService,
            mockInventoryService
        );
    });

    test('결제가 정상적으로 처리되어야 한다', async () => {
        const receipt = await paymentService.processPayment(mockCart, false);

        expect(receipt.totalAmount).toBe(3000);
        expect(receipt.promotionDiscount).toBe(1000);
        expect(receipt.items).toHaveLength(1);
        expect(mockInventoryService.updateInventory).toHaveBeenCalledWith(
            mockCart.getItems(),
            receipt.freeItems
        );
    });

    test('멤버십 할인이 적용된 결제가 처리되어야 한다', async () => {
        const receipt = await paymentService.processPayment(mockCart, true);

        expect(receipt.membershipDiscount).toBe(600);
        expect(mockDiscountService.calculateMembershipDiscount)
            .toHaveBeenCalledWith(2000);
        expect(mockInventoryService.updateInventory).toHaveBeenCalled();
    });

    test('재고가 정상적으로 업데이트되어야 한다', async () => {
        const cartItems = mockCart.getItems();
        const mockFreeItems = [{ product: mockProduct, quantity: 1 }];

        await paymentService.processPayment(mockCart, false);

        expect(mockInventoryService.updateInventory)
            .toHaveBeenCalledWith(cartItems, mockFreeItems);
    });

    test('재고가 부족할 경우 에러를 발생시켜야 한다', async () => {
        mockInventoryService.checkStockAvailability.mockReturnValue(false);
        mockInventoryService.updateInventory.mockImplementation(() => {
            throw new Error('[ERROR] 재고 수량을 초과하여 구매할 수 없습니다.');
        });

        await expect(paymentService.processPayment(mockCart, false))
            .rejects.toThrow('재고 수량을 초과하여 구매할 수 없습니다.');
    });

    test('프로모션 적용 가능 여부를 확인할 수 있어야 한다', () => {
        mockDiscountService.canApplyPromotion.mockReturnValue(true);

        expect(paymentService.canApplyPromotion(mockProduct, 2)).toBeTruthy();
        expect(mockDiscountService.canApplyPromotion)
            .toHaveBeenCalledWith(mockProduct, 2);
    });

    test('프로모션에 필요한 수량을 확인할 수 있어야 한다', () => {
        const requiredQuantity = paymentService.getRequiredQuantityForPromotion(mockProduct);
        expect(requiredQuantity).toBe(2);
    });

    test('결제 시 재고 업데이트에 실패하면 에러를 발생시켜야 한다', async () => {
        mockInventoryService.updateInventory.mockImplementation(() => {
            throw new Error('재고 업데이트 실패');
        });

        await expect(paymentService.processPayment(mockCart, false))
            .rejects.toThrow('재고 업데이트 실패');
    });
});