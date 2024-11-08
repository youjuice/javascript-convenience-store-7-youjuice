import { Console } from '@woowacourse/mission-utils';

class OutputView {
    printWelcome() {
        Console.print("안녕하세요. W편의점입니다.");
        Console.print("현재 보유하고 있는 상품입니다.\n");
    }

    printProducts(products) {
        products.forEach(product => {
            Console.print(`- ${product.name} ${this.formatPrice(product.price)} ${this.formatStock(product)}`);
        });
        Console.print("");
    }

    printReceipt(receipt) {
        Console.print("===========W 편의점=============");
        Console.print("상품명\t\t수량\t금액");

        receipt.items.forEach(item => {
            const amount = this.formatNumber(item.product.price * item.quantity);
            Console.print(`${item.product.name}\t\t${item.quantity}\t${amount}`);
        });

        if (receipt.freeItems.length > 0) {
            Console.print("===========증\t정=============");
            receipt.freeItems.forEach(item => {
                Console.print(`${item.product.name}\t\t${item.quantity}`);
            });
        }

        Console.print("==============================");
        Console.print(`총구매액\t\t${receipt.totalQuantity}\t${this.formatNumber(receipt.totalAmount)}`);
        Console.print(`행사할인\t\t\t-${this.formatNumber(receipt.promotionDiscount)}`);
        Console.print(`멤버십할인\t\t\t-${this.formatNumber(receipt.membershipDiscount)}`);
        Console.print(`내실돈\t\t\t ${this.formatNumber(receipt.finalAmount)}`);
        Console.print("");
    }

    printError(message) {
        Console.print(message);
    }

    formatPrice(price) {
        return `${price.toLocaleString()}원`;
    }

    formatStock(product) {
        if (product.stock === 0) {
            return '재고 없음';
        }
        return `${product.stock}개${product.promotionType ? ' ' + product.promotionType : ''}`;
    }

    formatNumber(number) {
        return number.toLocaleString();
    }
}

export default OutputView;