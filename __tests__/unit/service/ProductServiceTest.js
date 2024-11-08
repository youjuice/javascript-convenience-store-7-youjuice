import ProductService from '../../../src/service/ProductService';
import { promises as fs } from "fs";

jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn()
    }
}));

describe('ProductService 클래스 테스트', () => {
    let productService;

    beforeEach(() => {
        productService = new ProductService();
        jest.clearAllMocks();
    });

    test('상품 정보를 정상적으로 로드해야 한다', async () => {
        const mockFileContent =
            '콜라 1000원 10개 탄산2+1\n' +
            '사이다 1000원 8개\n';

        fs.readFile.mockResolvedValue(mockFileContent);

        await productService.loadProducts();

        const cola = productService.getProduct('콜라');
        expect(cola.name).toBe('콜라');
        expect(cola.price).toBe(1000);
        expect(cola.stock).toBe(10);
        expect(cola.promotionType).toBe('탄산2+1');

        const cider = productService.getProduct('사이다');
        expect(cider.promotionType).toBeNull();
    });

    test('잘못된 형식의 파일 내용에 대해 에러가 발생해야 한다', async () => {
        const mockFileContent = '잘못된 형식의 상품 정보';
        fs.readFile.mockResolvedValue(mockFileContent);

        await expect(productService.loadProducts()).rejects.toThrow('[ERROR]');
    });

    test('존재하지 않는 상품 조회 시 에러가 발생해야 한다', async () => {
        expect(() => productService.getProduct('없는상품')).toThrow('[ERROR]');
    });

    test('모든 상품 목록을 조회할 수 있어야 한다', async () => {
        const mockFileContent =
            '콜라 1000원 10개 탄산2+1\n' +
            '사이다 1000원 8개\n';

        fs.readFile.mockResolvedValue(mockFileContent);
        await productService.loadProducts();

        const allProducts = productService.getAllProducts();
        expect(allProducts).toHaveLength(2);
        expect(allProducts[0].name).toBe('콜라');
        expect(allProducts[1].name).toBe('사이다');
    });
});