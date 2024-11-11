import ProductService from './service/ProductService.js';
import PromotionService from './service/PromotionService.js';
import DiscountService from './service/DiscountService.js';
import InputView from './view/InputView.js';
import OutputView from './view/OutputView.js';
import Membership from './domain/Membership.js';
import OrderService from "./service/OrderService.js";
import ProductRepository from "./repositories/ProductRepository.js";
import PromotionRepository from "./repositories/PromotionRepository.js";
import CartService from "./service/CartService.js";
import {CONFIG} from "./constants/config.js";
import ShoppingService from "./service/ShoppingService.js";

class App {
  constructor() {
    this.initializeViews();
    this.initializeRepositories();
    this.initializeServices();
  }

  initializeViews() {
    this.inputView = new InputView();
    this.outputView = new OutputView();
  }

  initializeRepositories() {
    this.productRepository = new ProductRepository();
    this.promotionRepository = new PromotionRepository();
  }

  initializeServices() {
    this.productService = new ProductService(this.productRepository);
    this.promotionService = new PromotionService(this.promotionRepository);
    this.cartService = new CartService();

    this.discountService = new DiscountService(
        this.promotionService,
        new Membership()
    );

    this.orderService = new OrderService(
        this.productService,
        this.promotionService,
        this.cartService,
        this.discountService,
        this.inputView,
        this.outputView
    );

    this.shoppingService = new ShoppingService(
        this.productService,
        this.orderService,
        this.outputView
    );
  }

  async initialize() {
    try {
      await this.productRepository.loadFromFile(CONFIG.FILE.PRODUCTS);
      await this.promotionRepository.loadFromFile(CONFIG.FILE.PROMOTIONS);
    } catch (error) {
      this.outputView.printError(error.message);
      throw error;
    }
  }

  async run() {
    await this.initialize();
    await this.shoppingService.startShopping();
  }
}

export default App;