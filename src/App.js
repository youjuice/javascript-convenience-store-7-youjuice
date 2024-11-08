import ProductService from './service/ProductService.js';
import PromotionService from './service/PromotionService.js';
import DiscountService from './service/DiscountService.js';
import PaymentService from './service/PaymentService.js';
import InputView from './view/InputView.js';
import OutputView from './view/OutputView.js';
import Membership from './domain/Membership.js';
import ValidationService from "./service/ValidationService.js";
import ShoppingService from './service/ShoppingService.js';
import OrderService from "./service/OrderService.js";

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
    this.validationService = new ValidationService(this.outputView);

    this.orderService = new OrderService(
        this.productService,
        this.paymentService,
        this.inputView,
        this.outputView,
        this.validationService
    );

    this.shoppingService = new ShoppingService(
        this.productService,
        this.paymentService,
        this.inputView,
        this.outputView,
        this.validationService,
        this.orderService
    );
  }

  async run() {
    await this.initialize();
    await this.shoppingService.startShopping();
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
}

export default App;