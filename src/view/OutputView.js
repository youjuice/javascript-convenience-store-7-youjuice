import { Console } from '@woowacourse/mission-utils';
import { formatter } from '../utils/formatter.js';
import { MESSAGES } from '../constants/messages.js';

class OutputView {
    printWelcome() {
        Console.print(MESSAGES.WELCOME);
        Console.print(MESSAGES.CURRENT_PRODUCTS);
    }

    printProducts(products) {
        products.forEach(product => {
            Console.print(`- ${product.name} ${formatter.formatPrice(product.price)} ${product.getStockInfo()}`);
        });
        Console.print("");
    }

    printReceipt(receipt) {
        const { RECEIPT } = MESSAGES;

        Console.print(RECEIPT.HEADER);
        Console.print(RECEIPT.HEADERS.ITEMS);

        receipt.items.forEach(item => {
            const amount = formatter.formatNumber(item.product.price * item.quantity);
            Console.print(`${item.product.name}\t\t${item.quantity}\t${amount}`);
        });

        if (receipt.freeItems.length > 0) {
            Console.print(RECEIPT.GIFT_HEADER);
            receipt.freeItems.forEach(item => {
                Console.print(`${item.product.name}\t\t${item.quantity}`);
            });
        }

        Console.print(RECEIPT.FOOTER);
        Console.print(`${RECEIPT.HEADERS.TOTAL}${receipt.totalQuantity}\t${formatter.formatNumber(receipt.totalAmount)}`);
        Console.print(`${RECEIPT.HEADERS.PROMOTION}${formatter.formatNumber(receipt.promotionDiscount)}`);
        Console.print(`${RECEIPT.HEADERS.MEMBERSHIP}${formatter.formatNumber(receipt.membershipDiscount)}`);
        Console.print(`${RECEIPT.HEADERS.FINAL}${formatter.formatNumber(receipt.finalAmount)}`);
        Console.print("");
    }

    printError(message) {
        Console.print(message);
    }
}

export default OutputView;