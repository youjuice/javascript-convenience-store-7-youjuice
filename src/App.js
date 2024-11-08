import ProductService from './service/ProductService.js';
import PromotionService from './service/PromotionService.js';
import DiscountService from './service/DiscountService.js';
import PaymentService from './service/PaymentService.js';
import InputView from './view/InputView.js';
import OutputView from './view/OutputView.js';
import Cart from './domain/Cart.js';
import Membership from './domain/Membership.js';

class App {
  constructor() {
    this.productService = new ProductService();
    this.promotionService = new PromotionService();
    this.membership = new Membership();
    this.discountService = new DiscountService(this.promotionService, this.membership);
    this.paymentService = new PaymentService(
        this.productService,
        this.promotionService,
        this.discountService
    );
    this.inputView = new InputView();
    this.outputView = new OutputView();
  }

  async run() {
    await this.initialize();
    await this.startShopping();
  }

  async initialize() {
    try {
      await this.productService.loadProducts();
      await this.promotionService.loadPromotions();
    } catch (error) {
      this.outputView.printError(error.message);
      throw error;
    }
  }

  async startShopping() {
    try {
      let continueShopping = true;
      this.outputView.printWelcome();

      while (continueShopping) {
        this.cart = new Cart(); // 각 쇼핑 세션마다 새로운 카트 생성
        this.outputView.printProducts(this.productService.getAllProducts());
        await this.processOrder();
        continueShopping = await this.checkAdditionalPurchase();
      }
    } catch (error) {
      this.outputView.printError(error.message);
      throw error;
    }
  }

  async processOrder() {
    try {
      await this.processProductInput();
      const useMembership = await this.processMembershipInput();
      await this.processPayment(useMembership);
    } catch (error) {
      this.outputView.printError(error.message);
      return this.processOrder();
    }
  }

  async processProductInput() {
    const input = await this.inputView.readItem();
    const items = this.parseProductInput(input);

    for (const {name, quantity} of items) {
      const product = this.productService.getProduct(name);

      if (this.paymentService.canApplyPromotion(product, quantity)) {
        const shouldAddPromotion = await this.confirmPromotionAdd(product);
        if (shouldAddPromotion) {
          this.cart.addItem(product, quantity + 1);
          continue;
        }
      }

      this.cart.addItem(product, quantity);
    }
  }

  parseProductInput(input) {
    const regex = /\[(.+?)-(\d+)]/g;
    const items = [];
    let match;

    while ((match = regex.exec(input)) !== null) {
      const quantity = Number(match[2]);
      if (quantity <= 0) {
        throw new Error('[ERROR] 올바르지 않은 수량입니다.');
      }
      items.push({
        name: match[1],
        quantity: quantity
      });
    }

    if (items.length === 0) {
      throw new Error('[ERROR] 올바르지 않은 형식으로 입력했습니다.');
    }

    return items;
  }

  async confirmPromotionAdd(product) {
    const answer = await this.inputView.readPromotionAdd(product.name);
    return answer === 'Y';
  }

  async processMembershipInput() {
    const answer = await this.inputView.readMembershipUse();
    return answer === 'Y';
  }

  async processPayment(useMembership) {
    const receipt = await this.paymentService.processPayment(this.cart, useMembership);
    this.outputView.printReceipt(receipt);
  }

  async checkAdditionalPurchase() {
    const answer = await this.inputView.readAdditionalPurchase();
    return answer === 'Y';
  }
}

export default App;