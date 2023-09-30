import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ItemView.module.css';

import icon from '../../assets/sprite.svg';
import { ROARBIKES_API, sleep } from '../../lib/api';
import AuthContext from '../../store/auth-context';
import { cartActions } from '../../store/cart-slice';
import ButtonSpinner from '../UI/ButtonSpinner';
import { appActions } from '../../store/app-slice';
import { useNavigate } from 'react-router-dom';
import { wishListActions } from '../../store/wishlist-slice';

const ItemView = (props) => {
    const authCtx = useContext(AuthContext);
    const [count, setCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const dispatch = useDispatch();
    const notification = useSelector((state) => state.app.notification);
    const cartItems = useSelector((state) => state.cart.items);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const navigate = useNavigate();

    const { _id: id, name, imageCover, price } = props.item;

    const isExistingInWishlist = wishlistItems.find((curitem) => curitem.item._id === id);

    const addToWishListNoAuthHandler = async () => {
        await sleep(1000);

        dispatch(
            wishListActions.addToWishlist({
                id,
                imageCover,
                name,
                price,
            })
        );

        setIsAdding(false);
    };

    const addToWishListAuthHandler = async () => {
        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/savedItem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item: id,
                }),
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Error adding product to wishlist.');

            const data = await res.json();

            dispatch(
                wishListActions.addToWishlist({
                    wishlistId: data.data.data._id,
                    userId: authCtx.userStatus.userId, // we can also get d user from the response data
                    id,
                    imageCover,
                    name,
                    price,
                })
            );
        } catch (err) {
            console.error(err.message);
        }
        setIsAdding(false);
    };

    const addToWishListHandler = () => {
        if (isExistingInWishlist) {
            return navigate('/wishlist');
        }
        if (isAdding) return;
        setIsAdding(true);

        if (!navigator.onLine) return;

        if (!authCtx.userStatus.userIsLoggedIn) {
            addToWishListNoAuthHandler();
        } else {
            addToWishListAuthHandler();
        }
    };

    /////////////////////////////////////////////////////////////////////////////

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
                },
                body: JSON.stringify(reqData),
                credentials: 'include',
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

                <button className={styles['wishlist-btn']} onClick={addToWishListHandler}>
                    {!isAdding && !isExistingInWishlist && (
                        <svg className={styles['wishlist-icon']}>
                            <use xlinkHref={`${icon}#icon-heart`} />
                        </svg>
                    )}
                    {isAdding && (
                        <span className={styles['spinner']}>
                            <ButtonSpinner type="dark" />
                        </span>
                    )}
                    {isExistingInWishlist && !isAdding && (
                        <svg className={styles['wishlist-icon']}>
                            <use xlinkHref={`${icon}#icon-check`} />
                        </svg>
                    )}

                    {!isExistingInWishlist && <span className={styles['span-text']}>Add to wishlist</span>}

                    {isExistingInWishlist && !isAdding && (
                        <span className={styles['span-text']}>Added to wishlist</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ItemView;
