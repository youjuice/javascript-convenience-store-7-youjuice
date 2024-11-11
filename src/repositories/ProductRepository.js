import { promises as fs } from 'fs';
import Product from '../domain/Product.js';
import { parser } from '../utils/parser.js';
import { MESSAGES } from '../constants/messages.js';
import BaseRepository from './BaseRepository.js';

class ProductRepository extends BaseRepository {
    async loadFromFile(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const lines = content.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('name'));

            await this.processProductLines(lines);
        } catch (error) {
            throw new Error(MESSAGES.ERROR.LOAD_PRODUCT_FAIL);
        }
    }

    async processProductLines(lines) {
        const processedNames = new Set();

        for (const line of lines) {
            const productInfo = parser.parseProductInfo(line);
            await this.addProduct(productInfo, processedNames);
        }
    }

    async addProduct(productInfo, processedNames) {
        const { name, price, stock, promotion } = productInfo;

        const product = new Product(name, price, stock, promotion);
        const key = this.generateKey(name, promotion);
        await this.save(key, product);

        // 프로모션 상품의 경우 재고없는 버전도 추가
        if (!processedNames.has(name) && promotion) {
            const noStockProduct = new Product(name, price, 0, promotion);
            await this.save(`${name}-nostock`, noStockProduct);
        }

        processedNames.add(name);
    }

    findByName(name) {
        return this.findAll().find(product =>
            product.name === name && !product.promotionType
        ) || this.findAll().find(product =>
            product.name === name
        );
    }

    updateStock(product, quantity, usePromotion = false) {
        const key = this.generateKey(product.name, product.promotionType);
        if (usePromotion && product.promotionStock > 0) {
            const promotionUse = Math.min(quantity, product.promotionStock);
            product.promotionStock -= promotionUse;
            quantity -= promotionUse;
        }

        if (quantity > 0) {
            product.stock -= quantity;
        }

        return this.save(key, product);
    }

    generateKey(name, promotionType) {
        return promotionType ? `${name}-promo` : name;
    }
}

export default ProductRepository;