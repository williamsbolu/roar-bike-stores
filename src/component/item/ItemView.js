import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ItemView.module.css';

import icon from '../../assets/sprite.svg';
import { ROARBIKES_API, sleep } from '../../lib/api';
import AuthContext from '../../store/auth-context';
import { cartActions } from '../../store/cart-slice';
import ButtonSpinner from '../UI/ButtonSpinner';
import { appActions } from '../../store/app-slice';

const ItemView = (props) => {
    const authCtx = useContext(AuthContext);
    const [count, setCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const notification = useSelector((state) => state.app.notification);
    const cartItems = useSelector((state) => state.cart.items);

    const { _id: id, name, imageCover, price } = props.item;

    async function addToCartNoAuth() {
        await sleep(1000);

        dispatch(
            cartActions.addItemToCart({
                id,
                imageCover,
                name,
                price,
                quantity: count,
            })
        );
    }

    async function addToCartAuth() {
        const existingCartItem = cartItems.find((cart) => cart.item._id === id);

        // Default: create a new cart item
        let url = `${ROARBIKES_API}/api/v1/cart`;
        let reqMethod = 'POST';
        let reqData = {
            item: id,
            price,
            quantity: count,
        };

        // if the item already exist
        if (existingCartItem) {
            let itemQuantity = existingCartItem.quantity;

            url = `${ROARBIKES_API}/api/v1/cart/${existingCartItem._id}`;
            reqMethod = 'PATCH';
            reqData = {
                quantity: (itemQuantity += count),
            };
        }

        try {
            const res = await fetch(url, {
                method: reqMethod,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authCtx.userStatus.userToken}`,
                },
                body: JSON.stringify(reqData),
            });

            if (!res.ok) throw new Error('Error adding cart data');

            const data = await res.json();

            let cartId;

            // get the cartId based on results formmat from post and patch
            if (!existingCartItem) {
                cartId = data.data.data._id;
            } else {
                cartId = data.updatedCartItem._id;
            }

            // After adding or updating our cart in the database, we then update it locally in our redux state
            dispatch(
                cartActions.addItemToCart({
                    cartId,
                    userId: authCtx.userStatus.userId,
                    id,
                    imageCover,
                    name,
                    price,
                    quantity: count,
                })
            );
        } catch (err) {
            dispatch(
                appActions.setNotification({
                    status: 'error',
                    message: err.message,
                })
            );
        }
    }

    const addToCartHandler = async () => {
        if (isLoading) return;
        setIsLoading(true);

        if (!navigator.onLine) return;

        // adding based on when d user is logged in or not.
        if (!authCtx.userStatus.userIsLoggedIn) {
            addToCartNoAuth();
        } else {
            addToCartAuth();
        }
    };

    useEffect(() => {
        if (notification) setIsLoading(false);
    }, [notification]);

    const increaseCounterHandler = () => {
        setCount((prevCount) => prevCount + 1);
    };
    const decreaseCounterHandler = () => {
        if (count === 1) return;
        setCount((prevCount) => prevCount - 1);
    };

    return (
        <div className={styles['item-view']}>
            <div className={styles['img-box']}>
                <img src={`${ROARBIKES_API}/img/items/${imageCover}`} alt={`${name}-img`} />
            </div>

            <div className={styles['view-box']}>
                <h2>{name}</h2>
                <p className={styles.price}>${price}</p>

                <div className={styles['cart-handler']}>
                    <div className={styles['counter']}>
                        <button className={styles.dec} onClick={decreaseCounterHandler}>
                            -
                        </button>
                        <span className={styles.quantity}>{count}</span>
                        <button className={styles.inc} onClick={increaseCounterHandler}>
                            +
                        </button>
                    </div>
                    <button className={styles['cart-btn']} onClick={addToCartHandler}>
                        {!isLoading ? 'Add To Cart' : <ButtonSpinner type="white" />}
                    </button>
                </div>

                <button className={styles['wishlist-btn']}>
                    <svg className={styles['wishlist-icon']}>
                        <use xlinkHref={`${icon}#icon-heart`} />
                    </svg>
                    <span className={styles['span-text']}>Add to wishlist</span>
                </button>
                {/* {isAdding && (
                    <button className={styles['wishlist-btn']} onClick={addToWishListHandler}>
                        <span className={styles['spinner']}>
                            <ProductItemSpinner />
                        </span>
                        <span className={styles['span-text']}>Add to wishlist</span>
                    </button>
                )}
                {isExistingInWishlist && !isAdding && (
                    <button className={styles['wishlist-btn']} onClick={addToWishListHandler}>
                        <svg className={styles['wishlist-icon']}>
                            <use xlinkHref={`${icon}#icon-check`} />
                        </svg>
                        <span className={styles['span-text']}>Added to wishlist</span>
                    </button>
                )} */}
            </div>
        </div>
    );
};

export default ItemView;
