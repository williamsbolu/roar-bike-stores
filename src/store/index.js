import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app-slice';
import cartReducer from './cart-slice';

const store = configureStore({
    reducer: { app: appReducer, cart: cartReducer },
});

export default store;
