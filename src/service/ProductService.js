import {MESSAGES} from "../constants/messages.js";

class ProductService {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async getProduct(name) {
        const product = await this.productRepository.findByName(name);
        if (!product) {
            throw new Error(MESSAGES.ERROR.INVALID_PRODUCT);
        }
        return product;
    }

    async getAllProducts() {
        return this.productRepository.findAll();
    }

    async checkStockAvailability(product, quantity) {
        return product.hasEnoughStock(quantity);
    }

    async updateStock(product, quantity, isPromotional = false) {
        return this.productRepository.updateStock(product, quantity, isPromotional);
    }
}

export default ProductService;