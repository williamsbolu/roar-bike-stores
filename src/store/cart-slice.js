import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalQuantity: 0,
        totalAmount: 0,
        changed: false,
    },
    reducers: {
        replaceCart(state, action) {
            state.items = action.payload.items;
            state.totalQuantity = action.payload.totalQuantity;
            state.totalAmount = action.payload.totalAmount;
        },
        addItemToCart(state, action) {
            const newItem = action.payload;
            // returns the item if it already exists in the cart
            const existingItem = state.items.find((curItem) => curItem.item._id === newItem.id);
            state.totalQuantity += newItem.quantity;

            if (!existingItem) {
                state.items.push({
                    _id: newItem.cartId || '',
                    user: newItem.userId || '',
                    item: {
                        _id: newItem.id,
                        imageCover: newItem.imageCover,
                        name: newItem.name,
                        // price: newItem.price,
                    },
                    price: newItem.price,
                    quantity: newItem.quantity,
                    itemPriceTotal: newItem.price * newItem.quantity,
                });
            } else {
                existingItem.quantity += newItem.quantity;
                existingItem.itemPriceTotal += newItem.price * newItem.quantity;
            }

            state.totalAmount += newItem.price * newItem.quantity;
            state.changed = true; // so the notification can display
        },
        removeItemQuantityFromCart(state, action) {
            const id = action.payload;
            const item = state.items.find((curItem) => curItem.item._id === id);

            if (item.quantity === 1) {
                state.items = state.items.filter((curItem) => curItem.item._id !== id);
            } else {
                item.quantity -= 1;
                item.itemPriceTotal -= item.price;
            }

            state.totalQuantity -= 1;
            state.totalAmount -= item.price;
            state.changed = true;
        },
        removeItemFromCart(state, action) {
            const id = action.payload;
            const item = state.items.find((curItem) => curItem.item._id === id);

            state.totalAmount -= item.itemPriceTotal;
            state.totalQuantity -= item.quantity;
            state.items = state.items.filter((curItem) => curItem.item._id !== id);
            state.changed = true;
        },
    },
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
