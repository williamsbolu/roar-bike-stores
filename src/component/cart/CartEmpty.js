import { Link } from 'react-router-dom';

import icon from '../../assets/sprite.svg';
import styles from './CartEmpty.module.css';

const CartEmpty = () => {
    return (
        <section className={styles['cart-empty']}>
            <svg className={styles['icon-nocart']}>
                <use xlinkHref={`${icon}#icon-remove_shopping_cart`} />
            </svg>

            <h1>Your cart is currently empty.</h1>
            <div className={styles['text-box']}>
                <p>Before proceed to checkout you must add some products to your shopping cart.</p>
                <p>You will find a lot of interesting products on our "Shop" page</p>
            </div>

            <Link to="/">Return to shop</Link>
        </section>
    );
};

export default CartEmpty;
