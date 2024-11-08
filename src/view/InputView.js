import { Console } from '@woowacourse/mission-utils';
import { MESSAGES } from '../constants/messages.js';

class InputView {
    async readItem() {
        return await Console.readLineAsync(MESSAGES.INPUT.PRODUCT);
    }

    async readPromotionAdd(productName) {
        const input = await Console.readLineAsync(MESSAGES.INPUT.PROMOTION_ADD(productName));
        return input.toUpperCase();
    }

    async readPromotionPurchase(productName, quantity) {
        const input = await Console.readLineAsync(MESSAGES.INPUT.PROMOTION_PURCHASE(productName, quantity));
        return input.toUpperCase();
    }

    async readMembershipUse() {
        const input = await Console.readLineAsync(MESSAGES.INPUT.MEMBERSHIP);
        return input.toUpperCase();
    }

    async readAdditionalPurchase() {
        const input = await Console.readLineAsync(MESSAGES.INPUT.ADDITIONAL_PURCHASE);
        return input.toUpperCase();
    }
}

export default InputView;