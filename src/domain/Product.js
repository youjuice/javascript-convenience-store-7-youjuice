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
        if (!name || typeof name !== 'string') {
            throw new Error('[ERROR] 상품명이 올바르지 않습니다.');
        }
        if (!Number.isInteger(price) || price <= 0) {
            throw new Error('[ERROR] 가격이 올바르지 않습니다.');
        }
        if (!Number.isInteger(stock) || stock < 0) {
            throw new Error('[ERROR] 재고 수량이 올바르지 않습니다.');
        }
    }

    hasEnoughStock(quantity) {
        return this.stock + this.promotionStock >= quantity;
    }

    reduceStock(quantity, usePromotion = false) {
        if (!this.hasEnoughStock(quantity)) {
            throw new Error('[ERROR] 재고가 부족합니다.');
        }

        if (usePromotion && this.promotionStock > 0) {
            // 프로모션 재고를 우선적으로 사용
            const promotionUse = Math.min(quantity, this.promotionStock);
            this.promotionStock -= promotionUse;
            quantity -= promotionUse;
        }

        if (quantity > 0) {
            this.stock -= quantity;
        }
    }

    setPromotionStock(stock) {
        if (!Number.isInteger(stock) || stock < 0) {
            throw new Error('[ERROR] 프로모션 재고 수량이 올바르지 않습니다.');
        }
        this.promotionStock = stock;
    }

    getStockInfo() {
        if (this.stock === 0 && this.promotionStock === 0) {
            return '재고 없음';
        }
        return `${this.stock + this.promotionStock}개${this.promotionType ? ' ' + this.promotionType : ''}`;
    }
}

export default Product;