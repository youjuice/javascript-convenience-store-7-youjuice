import { promises as fs } from 'fs';
import Product from '../domain/Product.js';
import { CONFIG } from '../constants/config.js';
import { MESSAGES } from '../constants/messages.js';
import { parser } from '../utils/parser.js';

class ProductService {
    constructor() {
        this.products = new Map();
    }

    async loadProducts() {
        try {
            const content = await fs.readFile(CONFIG.FILE.PRODUCTS, 'utf-8');
            const lines = content.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('name'));

            this.processProductLines(lines);
        } catch (error) {
            if (error.message.includes('[ERROR]')) {
                throw error;
            }
            throw new Error(MESSAGES.ERROR.LOAD_PRODUCT_FAIL);
        }
    }

    processProductLines(lines) {
        const processedNames = new Set();

        for (const line of lines) {
            const productInfo = parser.parseProductInfo(line);
            this.addProduct(productInfo, processedNames);
        }
    }

    addProduct(productInfo, processedNames) {
        const { name, price, stock, promotion } = productInfo;

        const product = new Product(name, price, stock, promotion);
        const key = promotion ? `${name}-promo` : name;
        this.products.set(key, product);

        if (!processedNames.has(name) && promotion) {
            const noStockProduct = new Product(name, price, 0, promotion);
            this.products.set(`${name}-nostock`, noStockProduct);
        }

        processedNames.add(name);
    }

    getProduct(name) {
        const normalProduct = Array.from(this.products.values())
            .find(p => p.name === name && !p.promotionType);
        const anyProduct = Array.from(this.products.values())
            .find(p => p.name === name);

        if (!normalProduct && !anyProduct) {
            throw new Error(MESSAGES.ERROR.INVALID_PRODUCT);
        }

        return normalProduct || anyProduct;
    }

    getAllProducts() {
        return Array.from(this.products.values());
    }
}

export default ProductService;