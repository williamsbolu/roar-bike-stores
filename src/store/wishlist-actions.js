import { ROARBIKES_API } from '../lib/api';
import { wishListActions } from './wishlist-slice';

export const getWishlistData = (token) => {
    return async (dispatch) => {
        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/savedItem/getUserSavedItems`, {
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Error getting wishlist data.');

            const data = await res.json();

            dispatch(
                wishListActions.replaceItems({
                    items: data.data.savedItems,
                    totalItems: data.results,
                })
            );
        } catch (err) {
            console.error(err.message);
            return;
        }
    };
};
