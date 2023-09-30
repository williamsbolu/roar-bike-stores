import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cartActions } from '../../store/cart-slice';
import { appActions } from '../../store/app-slice';

import classes from './CartItem.module.css';
import AuthContext from '../../store/auth-context';
import cancelIcon from '../../assets/sprite.svg';
import { ROARBIKES_API, sleep } from '../../lib/api';

const CartItem = (props) => {
    const authCtx = useContext(AuthContext);
    const [isLoading, setIsloading] = useState(false);
    const dispatch = useDispatch();

    const { itemId, id, img, name, price, quantity, itemPriceTotal } = props; // id is d cart id, itemId is the product id

    // NOTE: 1) id is the cart id from the database (used in the database to delete cart)
    //       2) itemId is the product id (used in the redux store to delete cart)

    const formattedItemTotalPrice = itemPriceTotal.toLocaleString();

    // delete's the item from the Cart
    async function removeItemFromCartAuthHandler() {
        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/cart/${id}`, {
                method: 'DELETE',
                // headers: {
                //     Authorization: `Bearer ${authCtx.userStatus.userToken}`,
                // },
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Error deleting cart data.');

            // remove the cartItem locally
            dispatch(cartActions.removeItemFromCart(itemId));
        } catch (err) {
            dispatch(
                appActions.setNotification({
                    status: 'error',
                    message: err.message,
                })
            );
        }
        setIsloading(false);
    }

    const removeWholeItemHandler = async () => {
        if (isLoading) return;
        setIsloading(true);

        if (!authCtx.userStatus.userIsLoggedIn) {
            await sleep(1000);
            setIsloading(false);
            dispatch(cartActions.removeItemFromCart(itemId));
        } else {
            removeItemFromCartAuthHandler();
        }
    };

    const manageCartQuantityHandler = async (type) => {
        let reqData;
        let itemQuantity = quantity;

        if (type === 'add') {
            reqData = {
                quantity: (itemQuantity += 1),
            };
        } else {
            reqData = {
                quantity: (itemQuantity -= 1),
            };
        }

        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/cart/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${authCtx.userStatus.userToken}`,
                },
                body: JSON.stringify(reqData),
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Error updating cart data.');

            if (type === 'add') {
                dispatch(
                    cartActions.addItemToCart({
                        id: itemId,
                        price,
                        quantity: 1,
                    })
                );
            } else {
                dispatch(cartActions.removeItemQuantityFromCart(itemId));
            }
        } catch (err) {
            dispatch(
                appActions.setNotification({
                    status: 'error',
                    message: err.message,
                })
            );
        }
        setIsloading(false);
    };

    const addItemHandler = async () => {
        if (isLoading) return;
        setIsloading(true);

        if (!authCtx.userStatus.userIsLoggedIn) {
            await sleep(1000);
            // here we're updating the quantity cuz the item exist already.
            setIsloading(false);
            return dispatch(
                cartActions.addItemToCart({
                    id: itemId,
                    price,
                    quantity: 1,
                })
            );
        }

        // if the user is logged in
        manageCartQuantityHandler('add');
    };

    const removeItemQuantityHandler = async () => {
        if (isLoading) return;
        setIsloading(true);

        if (!authCtx.userStatus.userIsLoggedIn) {
            await sleep(1000);
            setIsloading(false);
            return dispatch(cartActions.removeItemQuantityFromCart(itemId));
        }

        // when loggedIn and the quantity remains 1 we remove the cart from d database and locally
        if (quantity === 1) {
            return removeItemFromCartAuthHandler();
        }

        // when the user is loggedIn
        manageCartQuantityHandler();
    };

    return (
        <tr className={classes['cart-item']}>
            <td className={classes['cancel-btn-box']}>
                <button onClick={removeWholeItemHandler}>
                    <svg className={classes['cancel-icon']}>
                        <use xlinkHref={`${cancelIcon}#icon-x`} />
                    </svg>
                </button>
            </td>
            <td className={classes['img-link-box']}>
                <div className={classes['img-link']}>
                    <img src={`${ROARBIKES_API}/img/items/${img}`} alt={`${name}-img`} />
                </div>
            </td>
            <td className={classes['description-box']}>
                <Link to={`/${id}`}>{name}</Link>
            </td>
            <td className={classes['price-box']}>
                <span className={classes.price}>${price}</span>
            </td>
            <td className={classes['counter-box']}>
                <div className={classes['counter']}>
                    <button className={classes.dec} onClick={removeItemQuantityHandler}>
                        -
                    </button>
                    <span className={classes.quantity}>{quantity}</span>
                    <button className={classes.inc} onClick={addItemHandler}>
                        +
                    </button>
                </div>
            </td>
            <td className={classes['total-price-box']}>
                <p className={classes['total-price']}>${formattedItemTotalPrice}</p>
            </td>
        </tr>
    );
};

export default CartItem;
