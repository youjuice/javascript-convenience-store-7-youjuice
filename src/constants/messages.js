export const MESSAGES = {
    WELCOME: "안녕하세요. W편의점입니다.",
    CURRENT_PRODUCTS: "현재 보유하고 있는 상품입니다.\n",
    INPUT: {
        PRODUCT: "구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])",
        PROMOTION_ADD: (productName) => `현재 ${productName}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`,
        MEMBERSHIP: "멤버십 할인을 받으시겠습니까? (Y/N)",
        ADDITIONAL_PURCHASE: "감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)"
    },
    ERROR: {
        INVALID_FORMAT: '[ERROR] 올바르지 않은 형식으로 입력했습니다.',
        INVALID_QUANTITY: '[ERROR] 올바르지 않은 수량입니다.',
        INSUFFICIENT_STOCK: '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
        INVALID_PRODUCT: '[ERROR] 존재하지 않는 상품입니다.',
        INVALID_DISCOUNT: '[ERROR] 올바르지 않은 할인입니다.',
        LOAD_PRODUCT_FAIL: '[ERROR] 상품 정보를 불러오는데 실패했습니다.',
        LOAD_PROMOTION_FAIL: '[ERROR] 프로모션 정보를 불러오는데 실패했습니다.',
        INVALID_YES_NO: '[ERROR] Y 또는 N으로 입력해 주세요.'
    },
    RECEIPT: {
        HEADER: "===========W 편의점=============",
        GIFT_HEADER: "===========증\t정=============",
        FOOTER: "==============================",
        HEADERS: {
            ITEMS: "상품명\t\t수량\t금액",
            TOTAL: "총구매액\t\t",
            PROMOTION: "행사할인\t\t\t-",
            MEMBERSHIP: "멤버십할인\t\t\t-",
            FINAL: "내실돈\t\t\t "
        }
    }
};