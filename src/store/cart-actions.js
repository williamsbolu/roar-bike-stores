import { ROARBIKES_API } from '../lib/api';
import { cartActions } from './cart-slice';

export const getCartData = (token) => {
    return async (dispatch) => {
        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/cart/getUserCartData`, {
                // headers: {
                //     Authorization: `Bearer ${token}`,
                // },
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Error getting cart data');

            const data = await res.json();

            dispatch(
                cartActions.replaceCart({
                    items: data.data.cartItems,
                    totalQuantity: data.data.totalQuantity,
                    totalAmount: data.data.totalAmount,
                })
            );
        } catch (err) {
            console.log(err.message);
            return;
        }
    };
};
