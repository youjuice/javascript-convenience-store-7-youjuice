import {validator} from "./validator.js";
import {MESSAGES} from "../constants/messages.js";

export const parser = {
    parseProductInput(input) {
        const regex = /\[(.+?)-(\d+)]/g;
        const items = [];
        let match;

        while ((match = regex.exec(input)) !== null) {
            const name = match[1];
            const quantity = Number(match[2]);

            validator.validatePositiveNumber(quantity, '수량');
            items.push({ name, quantity });
        }

        if (items.length === 0) {
            throw new Error(MESSAGES.ERROR.INVALID_FORMAT);
        }

        return items;
    },

    parseProductInfo(line) {
        const [name, price, stock, promotion] = line.split(',').map(item => item?.trim());

        if (!name || !price || !stock || isNaN(Number(price)) || isNaN(Number(stock))) {
            throw new Error(MESSAGES.ERROR.INVALID_PRODUCT_FORMAT);
        }

        return {
            name,
            price: Number(price),
            stock: Number(stock),
            promotion: promotion === 'null' ? null : promotion
        };
    },

    parsePromotionInfo(line) {
        const [type, quantity] = line.split(',').map(item => item?.trim());

        if (!type || !quantity || isNaN(Number(quantity))) {
            throw new Error(MESSAGES.ERROR.INVALID_PROMOTION_FORMAT);
        }

        return {
            type,
            requiredQuantity: Number(quantity)
        };
    }
};