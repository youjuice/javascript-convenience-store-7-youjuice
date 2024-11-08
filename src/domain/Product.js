import { validator } from '../utils/validator.js';
import { MESSAGES } from '../constants/messages.js';
import {formatter} from "../utils/formatter.js";

class Product {
    constructor(name, price, stock, promotionType = null) {
        this.validateProductInfo(name, price, stock);
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.promotionStock = 0;
        this.promotionType = promotionType;
    }

    validateProductInfo(name, price, stock) {
        validator.validateString(name, '상품명');
        validator.validatePositiveNumber(price, '가격');
        validator.validateNumber(stock, '재고 수량');
    }

    hasEnoughStock(quantity) {
        return this.stock + this.promotionStock >= quantity;
    }

    reduceStock(quantity, usePromotion = false) {
        if (!this.hasEnoughStock(quantity)) {
            throw new Error(MESSAGES.ERROR.INSUFFICIENT_STOCK);
        }

        if (usePromotion && this.promotionStock > 0) {
            const promotionUse = Math.min(quantity, this.promotionStock);
            this.promotionStock -= promotionUse;
            quantity -= promotionUse;
        }

        if (quantity > 0) {
            this.stock -= quantity;
        }
    }

    setPromotionStock(stock) {
        validator.validateNumber(stock, '프로모션 재고 수량');
        this.promotionStock = stock;
    }

    getStockInfo() {
        return formatter.formatStock(this.stock + this.promotionStock, this.promotionType);
    }
}

export default Product;