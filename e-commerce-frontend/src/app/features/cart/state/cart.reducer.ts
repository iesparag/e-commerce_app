import { createReducer, on } from '@ngrx/store';
import { initialCartState, CartState } from './cart.state';
import * as CartActions from './cart.actions';

export const cartReducer = createReducer(
  initialCartState,

  // Get user cart: start loading
  on(CartActions.getUserCart, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  // Get user cart: success
  on(CartActions.getUserCartSuccess, (state, { response }) => {
    return ({
    ...state,
    isLoading: false,
    items: response.success ? response.data : state.items, // Replace items on success
    error: response.success ? null : response.message, // Set error if response fails
  })}),

  // Get user cart: failure
  on(CartActions.getUserCartFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Add to cart: start loading
  on(CartActions.addToCart, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  // Add to cart: success
  on(CartActions.addToCartSuccess, (state, { cartItem }) => {
    const existingItemIndex = state.items.findIndex(
      (item) => item.product.productId === cartItem.product.productId
    );

    let updatedItems = [...state.items];
    if (existingItemIndex > -1) {
      // Update quantity of existing item
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + cartItem.quantity,
      };
    } else {
      // Add new item to the cart
      updatedItems.push(cartItem);
    }

    return {
      ...state,
      isLoading: false,
      items: updatedItems,
    };
  }),

  // Add to cart: failure
  on(CartActions.addToCartFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Update product quantity: start loading
  on(CartActions.updateProductQuantity, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  // Update product quantity: success
  on(CartActions.updateProductQuantitySuccess, (state, { cartItem }) => {
    const updatedItems = state.items.map((item) =>{
      return item.product.productId === cartItem.product.productId
        ? { ...item, quantity: cartItem.quantity }
        : item}
    );

    return {
      ...state,
      isLoading: false,
      items: updatedItems,
    };
  }),

  // Update product quantity: failure
  on(CartActions.updateProductQuantityFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  ////////////////////////////////////
  // Update product quantity: start loading
  on(CartActions.deleteItemFromCartStart, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  // filter out the product on delete Success
  on(CartActions.deleteItemFromCartSuccess, (state, { cartItem }) => {
    const updatedItems = state.items.filter((item) =>item.product.productId !== cartItem.product.productId);
    return {
      ...state,
      isLoading: false,
      items: updatedItems,
    };
  }),

  // Update product quantity: failure
  on(CartActions.deleteItemFromCartFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // ///////////////////////////////////////////


  on(CartActions.moveToSaveForLaterItemFromCartStart, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  // filter out the product on delete Success
  on(CartActions.moveToSaveForLaterItemFromCartSuccess, (state, { cartItem }) => {
    const updatedItems = state.items.filter((item) =>item.product.productId !== cartItem.product.productId);
    return {
      ...state,
      isLoading: false,
      items: updatedItems,
    };
  }),

  // Update product quantity: failure
  on(CartActions.moveToSaveForLaterItemFromCartFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // ///////////////////////////////////////////

  on(CartActions.moveFromWishlistToCartStart, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  // filter out the product on delete Success
  on(CartActions.moveFromWishlistToCartSuccess, (state, { cartItem }) => {
    console.log('state: iiiiiiiiiiiiiiiiiiiiiiiii', state);
    console.log('cartItem: ', cartItem);
    const updatedItems = state.items.some((elem)=> elem.product.productId === cartItem.product.productId)
    return {
      ...state,
      isLoading: false,
      items: updatedItems ? state.items : [...state.items,cartItem],
    };
  }),

  // Update product quantity: failure
  on(CartActions.moveFromWishlistToCartFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),


  // ///////////////////////////////////////////

  on(CartActions.moveToWishlistFromCartStart, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  // filter out the product on delete Success
  on(CartActions.moveToWishlistFromCartSuccess, (state, { cartItem }) => {
    const updatedItems = state.items.filter((elem)=> elem.product.productId !== cartItem.product.productId)
    return {
      ...state,
      isLoading: false,
      items: updatedItems,
    };
  }),

  // Update product quantity: failure
  on(CartActions.moveToWishlistFromCartFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
