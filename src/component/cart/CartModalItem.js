import { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { cartActions } from '../../store/cart-slice';

import classes from './CartModalItem.module.css';
import AuthContext from '../../store/auth-context';
import cancelIcon from '../../assets/sprite.svg';
import { Link } from 'react-router-dom';
import { ROARBIKES_API, sleep } from '../../lib/api';

const CartModalItem = (props) => {
    const authCtx = useContext(AuthContext);
    const [isLoading, setIsloading] = useState(false); // later we can show a loading state for updating user data
    const dispatch = useDispatch();

    // NOTE: 1) props.id is the cart id from the database (used in the database to delete cart)
    //       2) itemId is the product id (used in the redux store to delete cart)
    async function removeCartAuthHandler() {
        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/cart/${props.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authCtx.userStatus.userToken}`,
                },
                // credentials: 'include',
            });

            if (!res.ok) throw new Error('Unable to delete cart data');

            dispatch(cartActions.removeItemFromCart(props.itemId));
        } catch (err) {
            console.log(err.message);
        }

        setIsloading(false);
    }

    const removeFromCartHandler = async () => {
        if (isLoading) return;

        setIsloading(true);

        if (!authCtx.userStatus.userIsLoggedIn) {
            await sleep(1000);
            dispatch(cartActions.removeItemFromCart(props.itemId));
            setIsloading(false);
        } else {
            removeCartAuthHandler();
        }
    };

    return (
        <li className={classes.item}>
            <div className={classes['item-image-box']}>
                <img src={`${ROARBIKES_API}/img/items/${props.img}`} alt={`${props.name}-img`} />
            </div>
            <div className={classes['item-content']}>
                <Link to={props.id} className={classes['content']} onClick={props.onClick}>
                    <h4>{props.name}</h4>
                    <div className={classes['content-box']}>
                        <span className={classes['content-quantity']}>{props.quantity} x</span>
                        <span className={classes['content-amount']}>${props.price}</span>
                    </div>
                </Link>
                <button className={classes['cancel-btn']} onClick={removeFromCartHandler}>
                    <svg className={classes['cancel-icon']}>
                        <use xlinkHref={`${cancelIcon}#icon-x`} />
                    </svg>
                </button>
            </div>
        </li>
    );
};

export default CartModalItem;
