import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app-slice';
import cartReducer from './cart-slice';
import wishlistReducer from './wishlist-slice';

const store = configureStore({
    reducer: { app: appReducer, cart: cartReducer, wishlist: wishlistReducer },
});

export default store;
