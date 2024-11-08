import { promises as fs } from 'fs';
import Product from '../domain/Product.js';

class ProductService {
    constructor() {
        this.products = new Map();
    }

    async loadProducts() {
        try {
            const content = await fs.readFile('public/products.md', 'utf-8');
            const lines = content.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('name'));

            // 모든 상품에 대해 재고가 0인 버전도 추가
            const products = new Map();
            const processedNames = new Set();

            for (const line of lines) {
                const [name, price, stock, promotion] = line.split(',').map(item => item?.trim());

                if (!name || !price || !stock || isNaN(Number(price)) || isNaN(Number(stock))) {
                    throw new Error('[ERROR] 잘못된 상품 정보 형식입니다.');
                }

                // 일반 상품 추가
                const product = new Product(
                    name,
                    Number(price),
                    Number(stock),
                    promotion === 'null' ? null : promotion
                );

                // 상품 키 생성 (프로모션 유무에 따라)
                const key = promotion === 'null' ? name : `${name}-promo`;
                products.set(key, product);

                // 처음 처리하는 상품이고 프로모션이 있는 경우, 재고 없음 버전도 추가
                if (!processedNames.has(name) && promotion !== 'null') {
                    const noStockProduct = new Product(name, Number(price), 0, promotion);
                    products.set(`${name}-nostock`, noStockProduct);
                }

                processedNames.add(name);
            }

            this.products = products;
        } catch (error) {
            if (error.message.includes('[ERROR]')) {
                throw error;
            }
            throw new Error('[ERROR] 상품 정보를 불러오는데 실패했습니다.');
        }
    }

    getAllProducts() {
        return Array.from(this.products.values());
    }

    getProduct(name) {
        // 프로모션이 없는 버전 또는 첫 번째 발견된 상품 반환
        const normalProduct = Array.from(this.products.values())
            .find(p => p.name === name && !p.promotionType);
        const anyProduct = Array.from(this.products.values())
            .find(p => p.name === name);

        if (!normalProduct && !anyProduct) {
            throw new Error('[ERROR] 존재하지 않는 상품입니다.');
        }

        return normalProduct || anyProduct;
    }
}

export default ProductService;