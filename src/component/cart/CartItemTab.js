import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import AuthContext from '../../store/auth-context';
import styles from './CartItemTab.module.css';
import { appActions } from '../../store/app-slice';
import { cartActions } from '../../store/cart-slice';
import cancelIcon from '../../assets/sprite.svg';
import { ROARBIKES_API, sleep } from '../../lib/api';

const CartItemTab = (props) => {
    const authCtx = useContext(AuthContext);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const { itemId, id, img, name, price, quantity, itemPriceTotal } = props;
    // NOTE: 1) id is the cart id from the database (used in the database to delete cart)
    //       2) itemId is the product id (used in the redux store to delete cart)
    const formattedItemTotalPrice = itemPriceTotal.toLocaleString();

    // delete's the item from the Cart
    async function removeItemFromCartAuthHandler() {
        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/cart/${id}`, {
                method: 'DELETE',
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
        setIsLoading(false);
    }

    const removeWholeItemHandler = async () => {
        if (isLoading) return;
        setIsLoading(true);

        if (!authCtx.userStatus.userIsLoggedIn) {
            await sleep(1000);
            setIsLoading(false);
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
        setIsLoading(false);
    };

    const addItemHandler = async () => {
        if (isLoading) return;
        setIsLoading(true);

        if (!authCtx.userStatus.userIsLoggedIn) {
            await sleep(1000);
            setIsLoading(false);
            // here we're updating the quantity cuz the item exist already.
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
        setIsLoading(true);

        if (!authCtx.userStatus.userIsLoggedIn) {
            await sleep(1000);
            setIsLoading(false);
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
        <li className={styles['cart-item']}>
            <Link to={`/${id}`} className={styles['img-box']}>
                <img src={`${ROARBIKES_API}/img/items/${img}`} className={styles.img} alt={`${name}-img`} />
            </Link>

            <div className={styles['detail-box']}>
                <div className={styles['detail-box-item']}>
                    <Link to={`/${id}`} className={styles['description-text']}>
                        {name}
                    </Link>

                    <button className={styles.cancel} onClick={removeWholeItemHandler}>
                        <svg className={styles['cancel-icon']}>
                            <use xlinkHref={`${cancelIcon}#icon-x`} />
                        </svg>
                    </button>
                </div>

                <div className={styles['detail-box-item']}>
                    <span className={styles.amount}>Price</span>
                    <span className={styles.price}>${price}</span>
                </div>

                <div className={styles['detail-box-item']}>
                    <span className={styles.quantity}>Quantity</span>

                    <div className={styles['counter']}>
                        <button className={styles.dec} onClick={removeItemQuantityHandler}>
                            -
                        </button>
                        <span className={styles.quantity}>{quantity}</span>
                        <button className={styles.inc} onClick={addItemHandler}>
                            +
                        </button>
                    </div>
                </div>

                <div className={styles['detail-box-item']}>
                    <span className={styles.total}>Subtotal</span>

                    <p className={styles['total-price']}>${formattedItemTotalPrice}</p>
                </div>
            </div>
        </li>
    );
};

export default CartItemTab;
