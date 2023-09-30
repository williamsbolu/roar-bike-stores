import { Link } from 'react-router-dom';

import noCart from '../../assets/sprite.svg';
import styles from './WishlistPageEmpty.module.css';

const WishlistPageEmpty = () => {
    return (
        <section className={styles['cart-empty']}>
            <svg className={styles['icon-nocart']}>
                <use xlinkHref={`${noCart}#icon-heart`} />
            </svg>

            <h1>Wishlist is empty.</h1>
            <div className={styles['text-box']}>
                <p>You don't have any products in the wishlist yet.</p>
                <p>You will find a lot of interesting products on our "Shop" page</p>
            </div>

            <Link to="/">Return to shop</Link>
        </section>
    );
};

export default WishlistPageEmpty;
