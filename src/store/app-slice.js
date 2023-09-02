import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
    name: 'app',
    initialState: { cartPageIsActive: null, notification: null },
    reducers: {
        setNotification(state, action) {
            state.notification = action.payload;
        },
    },
});

export const appActions = appSlice.actions;

export default appSlice.reducer;
