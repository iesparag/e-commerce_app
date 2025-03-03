export const Constants = {
    users: {
        USER_REGISTER: 'users/register',
        USER_LOGIN: 'users/login',
        USER_LOGOUT: 'users/logout',
        USER_GENERATE_ACCESS_BY_REFRESH: 'users/refresh-token',
        USER_SAVE_ADDRESS: 'user-address/add',
    },
    buyer: {
        CATEGORIES: 'buyer/categories',
        SUBCATEGORIES: 'buyer/subcategories',
        PRODUCTS: 'buyer/products',
        PRODUCTSEARCH: 'buyer/products/search',
        CART: 'buyer/cart',
        ORDERS: 'buyer/orders',
        GETSAVEFORLATER: 'save-for-later',
        moveItemFromCartToSaveForLater: 'move-item-from-cart-to-sav-for-later',
        moveItemFromSaveForLaterToCart: 'move-item-from-save-for-later-to-cart',
        CART_TO_CART: 'move-to-cart',
        WISHLIST: 'buyer/wishlist',
        PAYMENT_CHECKOUT: 'buyer/payment/create-checkout-session',
    },
};


// /api/v1/buyer/subcategories