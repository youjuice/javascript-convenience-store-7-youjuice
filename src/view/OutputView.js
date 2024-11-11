import { Console } from '@woowacourse/mission-utils';
import { formatter } from '../utils/formatter.js';
import { MESSAGES } from '../constants/messages.js';

class OutputView {
    printWelcome() {
        Console.print(MESSAGES.WELCOME);
        Console.print(MESSAGES.CURRENT_PRODUCTS);
    }

    printProducts(products) {
        const groupedProducts = {};

        products.forEach(product => {
            const key = `${product.name}-${product.price}`;
            if (!groupedProducts[key]) {
                groupedProducts[key] = [];
            }
            groupedProducts[key].push(product);
        });

        for (const productGroup of Object.values(groupedProducts)) {
            const promotionProduct = productGroup.find(product => product.promotionType);
            const regularProduct = productGroup.find(product => !product.promotionType);

            if (promotionProduct) {
                Console.print(`- ${promotionProduct.name} ${formatter.formatPrice(promotionProduct.price)} ${promotionProduct.getStockInfo()}`);

                if (regularProduct) {
                    Console.print(`- ${regularProduct.name} ${formatter.formatPrice(regularProduct.price)} ${regularProduct.getStockInfo()}`);
                } else {
                    Console.print(`- ${promotionProduct.name} ${formatter.formatPrice(promotionProduct.price)} 재고 없음`);
                }
            } else if (regularProduct) {
                Console.print(`- ${regularProduct.name} ${formatter.formatPrice(regularProduct.price)} ${regularProduct.getStockInfo()}`);
            }
        }

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