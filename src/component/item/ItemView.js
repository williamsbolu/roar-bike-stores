import styles from './ItemView.module.css';

import ItemForm from './ItemForm';
import icon from '../../assets/sprite.svg';
import { ROARBIKES_API } from '../../lib/api';

const ProductView = (props) => {
    return (
        <div className={styles['product-view']}>
            <div className={styles['img-box']}>
                <img src={`${ROARBIKES_API}/img/items/${props.item.imageCover}`} alt={props.item.name} />
            </div>

            <div className={styles['view-box']}>
                <h2>{props.item.name}</h2>
                <p className={styles.price}>${props.item.price}</p>
                <ItemForm />
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

export default ProductView;
