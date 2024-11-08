export const formatter = {
    formatPrice(price) {
        return `${price.toLocaleString()}원`;
    },

    formatStock(stock, promotionType = null) {
        if (stock === 0) {
            return '재고 없음';
        }
        return `${stock}개${promotionType ? ' ' + promotionType : ''}`;
    },

    formatNumber(number) {
        return number.toLocaleString();
    }
};