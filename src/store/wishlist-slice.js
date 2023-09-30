import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        totalItems: 0,
    },
    reducers: {
        replaceItems(state, action) {
            state.items = action.payload.items;
            state.totalItems = action.payload.totalItems;
        },
        addToWishlist(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find((cur) => cur.item._id === newItem.id); // changes
            state.totalItems += 1;

            if (!existingItem) {
                state.items.push({
                    _id: newItem.wishlistId || '',
                    user: newItem.userId || '',
                    item: {
                        _id: newItem.id,
                        imageCover: newItem.imageCover,
                        name: newItem.name,
                        price: newItem.price,
                        slug: newItem.slug,
                    },
                });
            } else {
                return;
            }
        },
        removeFromWishList(state, action) {
            state.totalItems -= 1;
            const id = action.payload;
            state.items = state.items.filter((cur) => cur.item._id !== id); // changes
        },
    },
});

export const wishListActions = wishlistSlice.actions;

export default wishlistSlice.reducer;
