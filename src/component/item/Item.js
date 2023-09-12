import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classes from './Item.module.css';
import { Link } from 'react-router-dom';

import AuthContext from '../../store/auth-context';
import ButtonSpinner from '../UI/ButtonSpinner';
import { cartActions } from '../../store/cart-slice';
import { ROARBIKES_API } from '../../lib/api';
import icon from '../../assets/sprite.svg';
import { sleep } from '../../lib/api';
import { appActions } from '../../store/app-slice';

const Item = (props) => {
    const authCtx = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const notification = useSelector((state) => state.app.notification);
    const cartItems = useSelector((state) => state.cart.items);

    const { id, imageCover, name, price } = props;

    async function addToCartNoAuthHandler() {
        await sleep(1000);

        dispatch(
            cartActions.addItemToCart({
                id,
                imageCover,
                name,
                price,
                quantity: 1,
            })
        );
    }

    async function addToCartAuthHandler() {
        const existingItem = cartItems.find((curItem) => curItem.item._id === id); // comparism by the product itemId

        // Default: create a new cart itemm
        let url = `${ROARBIKES_API}/api/v1/cart`;
        let reqMethod = 'POST';
        let reqData = {
            // user: authCtx.userStatus.userId, // our api will automatically include d user
            item: id,
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
                    Authorization: `Bearer ${authCtx.userStatus.userToken}`,
                },
                body: JSON.stringify(reqData),
            });

            if (!res.ok) throw new Error('Error adding cart data');

            const data = await res.json();

            // console.log(data);

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
                    id,
                    imageCover,
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
            <Link to={`/product/${id}`} className={classes['item__detail']}>
                <img
                    src={`${ROARBIKES_API}/img/items/${imageCover}`}
                    alt={`${name}-img`}
                    className={classes['item-img']}
                />
            </Link>

            <button className={classes['item__btn--heart']}>
                <svg className={classes['item__icon-heart']}>
                    <use xlinkHref={`${icon}#icon-heart`} />
                </svg>
            </button>

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

export default Item;
