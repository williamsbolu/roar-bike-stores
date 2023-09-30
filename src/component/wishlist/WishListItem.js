import classes from './WishListItem.module.css';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AuthContext from '../../store/auth-context';
import { wishListActions } from '../../store/wishlist-slice';
import { cartActions } from '../../store/cart-slice';
import { appActions } from '../../store/app-slice';
import icon from '../../assets/sprite.svg';
import ButtonSpinner from '../UI/ButtonSpinner';
import { ROARBIKES_API, sleep } from '../../lib/api';

const WishListItem = (props) => {
    const authCtx = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const cartItems = useSelector((state) => state.cart.items);
    const notification = useSelector((state) => state.app.notification);
    const dispatch = useDispatch();

    const { itemId, id, img, name, price, slug } = props;
    // NOTE: 1) id is the wishlist id from the database (used in the database to delete cart)
    //       2) itemId is the product id (used in the redux store to delete cart)

    const removeFromWishListAuthHandler = async () => {
        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/savedItem/${id}`, {
                method: 'DELETE',
                // headers: {
                //     Authorization: `Bearer ${authCtx.userStatus.userToken}`,
                // },
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Error removing wishlist data.');

            // delete the item locally
            dispatch(wishListActions.removeFromWishList(itemId));
        } catch (err) {
            dispatch(
                appActions.setNotification({
                    status: 'error',
                    message: err.message,
                })
            );
        }
    };

    const removeFromWishListHandler = async () => {
        if (!navigator.onLine) return;

        if (!authCtx.userStatus.userIsLoggedIn) {
            await sleep(1000);
            dispatch(wishListActions.removeFromWishList(itemId));
            return;
        }

        // Runs when d user is logged in
        removeFromWishListAuthHandler();
    };

    async function addToCartNoAuthHandler() {
        await sleep(1000);

        dispatch(
            cartActions.addItemToCart({
                id: itemId,
                imageCover: img,
                name,
                price,
                quantity: 1,
            })
        );
    }

    async function addToCartAuthHandler() {
        const existingItem = cartItems.find((curItem) => curItem.item._id === itemId); // comparism by the product itemId

        // Default: create a new cart itemm
        let url = `${ROARBIKES_API}/api/v1/cart`;
        let reqMethod = 'POST';
        let reqData = {
            // user: authCtx.userStatus.userId, // our api will automatically include d user
            item: itemId,
            price: price,
        };

        // if the item exist in the cart already, then we update the cart with the "patch" request with d id gotten from the existing cart ite
        if (existingItem) {
            let itemQuantity = existingItem.quantity;

            url = `${ROARBIKES_API}/api/v1/cart/${existingItem._id}`;
            reqMethod = 'PATCH';
            reqData = {
                quantity: (itemQuantity += 1),
            };
        }

        try {
            const res = await fetch(url, {
                method: reqMethod,
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${authCtx.userStatus.userToken}`,
                },
                body: JSON.stringify(reqData),
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Error adding cart data');

            const data = await res.json();

            let cartId;

            // get the cartId based on results formmat from post and patch
            if (!existingItem) {
                cartId = data.data.data._id;
            } else {
                cartId = data.updatedCartItem._id;
            }

            // After adding or updating our cart in the database, we then update it locally in our redux state
            dispatch(
                cartActions.addItemToCart({
                    cartId,
                    userId: authCtx.userStatus.userId,
                    id: itemId,
                    imageCover: img,
                    name,
                    price,
                    quantity: 1,
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

        if (!authCtx.userStatus.userIsLoggedIn) {
            addToCartNoAuthHandler();
        } else {
            addToCartAuthHandler();
        }
    };

    useEffect(() => {
        if (notification) setIsLoading(false);
    }, [notification]);

    return (
        <div className={classes.item}>
            <button className={classes['item__btn--cancel']} onClick={removeFromWishListHandler}>
                <span>Remove</span>
                <svg className={classes['item__icon-x']}>
                    <use xlinkHref={`${icon}#icon-x`} />
                </svg>
            </button>

            <Link to={`/product/${slug}`} className={classes['item__detail']}>
                <img src={`${ROARBIKES_API}/img/items/${img}`} alt={`${name}-img`} className={classes['item-img']} />
            </Link>

            <button className={classes['item__btn--cart']} onClick={addToCartHandler}>
                {!isLoading && (
                    <svg className={classes['item__icon-cart']}>
                        <use xlinkHref={`${icon}#icon-shopping-cart`} />
                    </svg>
                )}
                {!isLoading && <span className={classes['item__btn--invisible']}>ADD TO CART</span>}
                {isLoading && <ButtonSpinner type="white" />}
            </button>

            <h3 className={classes.detail}>{name}</h3>

            <p className={classes.price}>${price}</p>
        </div>
    );
};

export default WishListItem;
