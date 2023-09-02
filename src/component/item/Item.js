import classes from './Item.module.css';
import { Link } from 'react-router-dom';

import { ROARBIKES_API } from '../../lib/api';
import icon from '../../assets/sprite.svg';

const Item = (props) => {
    return (
        <div className={classes.item}>
            <Link to={`/product/${props.id}`} className={classes['item__detail']}>
                <img src={`${ROARBIKES_API}/img/items/${props.imageCover}`} alt="img" className={classes['item-img']} />
            </Link>

            <button className={classes['item__btn--heart']}>
                <svg className={classes['item__icon-heart']}>
                    <use xlinkHref={`${icon}#icon-heart`} />
                </svg>
            </button>

            <button className={classes['item__btn--cart']}>
                <svg className={classes['item__icon-cart']}>
                    <use xlinkHref={`${icon}#icon-shopping-cart`} />
                </svg>
                <span className={classes['item__btn--invisible']}>ADD TO CART</span>
            </button>

            <h3 className={classes.detail}>{props.name}</h3>

            <p className={classes.price}>${props.price}</p>
        </div>
    );
};

export default Item;
