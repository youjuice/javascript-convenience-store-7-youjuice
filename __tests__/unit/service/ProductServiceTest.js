import ProductService from '../../../src/service/ProductService.js';
import ProductRepository from '../../../src/repositories/ProductRepository.js';
import { MESSAGES } from '../../../src/constants/messages.js';
import Product from '../../../src/domain/Product.js';

describe('ProductService 클래스 테스트', () => {
    let productService;
    let productRepository;

    beforeEach(() => {
        productRepository = new ProductRepository();
        productService = new ProductService(productRepository);
    });

    test('getProduct 메서드가 올바르게 동작해야 한다', async () => {
        // 존재하는 상품 조회
        const mockProduct = new Product('콜라', 1000, 10, '탄산2+1');
        jest.spyOn(productRepository, 'findByName').mockResolvedValue(mockProduct);

        const product = await productService.getProduct('콜라');
        expect(product).toEqual(mockProduct);

        // 존재하지 않는 상품 조회
        jest.spyOn(productRepository, 'findByName').mockResolvedValue(null);
        await expect(productService.getProduct('없는상품')).rejects.toThrow(MESSAGES.ERROR.INVALID_PRODUCT);
    });

    test('getAllProducts 메서드가 올바르게 동작해야 한다', async () => {
        const mockProducts = [
            new Product('콜라', 1000, 10, '탄산2+1'),
            new Product('콜라', 1000, 10, null),
            new Product('사이다', 1000, 8, '탄산2+1'),
            new Product('사이다', 1000, 7, null)
        ];
        jest.spyOn(productRepository, 'findAll').mockReturnValue(mockProducts);

        const allProducts = await productService.getAllProducts();
        expect(allProducts).toEqual(mockProducts);
    });

    test('checkStockAvailability 메서드가 올바르게 동작해야 한다', async () => {
        const mockProduct = new Product('콜라', 1000, 10, '탄산2+1');

        expect(await productService.checkStockAvailability(mockProduct, 5)).toBeTruthy();
        expect(await productService.checkStockAvailability(mockProduct, 11)).toBeFalsy();
    });

    test('updateStock 메서드가 올바르게 동작해야 한다', async () => {
        const mockProduct = new Product('콜라', 1000, 10, '탄산2+1');
        jest.spyOn(productRepository, 'updateStock').mockReturnValue(mockProduct);

        const updatedProduct = await productService.updateStock(mockProduct, 3);
        expect(updatedProduct).toEqual(mockProduct);
    });
});