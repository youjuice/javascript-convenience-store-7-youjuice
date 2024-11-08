import ProductService from '../../../src/service/ProductService.js';
import { promises as fs } from 'fs';

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
            'name,price,quantity,promotion\n' +
            '콜라,1000,10,탄산2+1\n' +
            '콜라,1000,10,null\n';

        fs.readFile.mockResolvedValue(mockFileContent);

        await productService.loadProducts();

        const cola = productService.getProduct('콜라');
        expect(cola.name).toBe('콜라');
        expect(cola.price).toBe(1000);
        expect(cola.stock).toBe(10);
    });

    test('잘못된 형식의 파일 내용에 대해 에러가 발생해야 한다', async () => {
        const mockFileContent = '잘못된,형식의,상품정보';
        fs.readFile.mockResolvedValue(mockFileContent);

        await expect(productService.loadProducts()).rejects.toThrow('[ERROR]');
    });

    test('존재하지 않는 상품 조회 시 에러가 발생해야 한다', async () => {
        expect(() => productService.getProduct('없는상품')).toThrow('[ERROR]');
    });

    test('모든 상품 목록을 조회할 수 있어야 한다', async () => {
        const mockFileContent =
            'name,price,quantity,promotion\n' +
            '콜라,1000,10,탄산2+1\n' +
            '콜라,1000,10,null\n' +
            '사이다,1000,8,탄산2+1\n' +
            '사이다,1000,7,null\n';

        fs.readFile.mockResolvedValue(mockFileContent);
        await productService.loadProducts();

        const allProducts = productService.getAllProducts();
        // 각 상품마다 3가지 버전이 있으므로 총 6개
        expect(allProducts).toHaveLength(6);

        // 콜라 관련 검증
        const colaProducts = allProducts.filter(p => p.name === '콜라');
        expect(colaProducts).toHaveLength(3);
        expect(colaProducts.some(p => p.promotionType === '탄산2+1' && p.stock > 0)).toBeTruthy();
        expect(colaProducts.some(p => p.promotionType === '탄산2+1' && p.stock === 0)).toBeTruthy();
        expect(colaProducts.some(p => p.promotionType === null)).toBeTruthy();

        // 사이다 관련 검증
        const ciderProducts = allProducts.filter(p => p.name === '사이다');
        expect(ciderProducts).toHaveLength(3);
        expect(ciderProducts.some(p => p.promotionType === '탄산2+1' && p.stock > 0)).toBeTruthy();
        expect(ciderProducts.some(p => p.promotionType === '탄산2+1' && p.stock === 0)).toBeTruthy();
        expect(ciderProducts.some(p => p.promotionType === null)).toBeTruthy();
    });

    test('재고가 0인 경우 재고 없음으로 표시되어야 한다', async () => {
        const mockFileContent =
            'name,price,quantity,promotion\n' +
            '콜라,1000,0,null\n';

        fs.readFile.mockResolvedValue(mockFileContent);
        await productService.loadProducts();

        const cola = productService.getProduct('콜라');
        expect(cola.getStockInfo()).toBe('재고 없음');
    });
});