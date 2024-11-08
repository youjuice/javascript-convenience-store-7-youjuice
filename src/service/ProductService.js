import Product from "../domain/Product.js";
import { promises as fs } from "fs";

class ProductService {
    constructor() {
        this.products = new Map();
    }

    async loadProducts() {
        try {
            const content = await fs.readFile('public/products.md', 'utf8');
            const lines = content.split('\n').filter(line => line.trim());

            lines.forEach(line => {
                const [name, price, stock, promotionType] = this.parseProductLine(line);
                const product = new Product(name, Number(price), Number(stock), promotionType || null);
                this.products.set(name, product);
            });
        } catch (error) {
            throw new Error('[ERROR] 상품 정보를 불러오는데 실패했습니다.');
        }
    }

    parseProductLine(line) {
        const match = line.match(/^(\S+)\s+(\d+)원\s+(\d+)개(?:\s+(.+))?$/);
        if (!match) {
            throw new Error('[ERROR] 상품 정보 형식이 올바르지 않습니다.');
        }
        return [match[1], match[2], match[3], match[4]];
    }

    getProduct(name) {
        const product = this.products.get(name);
        if (!product) {
            throw new Error('[ERROR] 존재하지 않는 상품입니다.');
        }
        return product;
    }

    getAllProducts() {
        return Array.from(this.products.values());
    }
}

export default ProductService;