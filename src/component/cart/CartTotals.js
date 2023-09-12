import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import classes from './CartTotals.module.css';

const CartTotals = () => {
    const cartTotal = useSelector((state) => state.cart.totalAmount);

    const formatCartTotal = cartTotal.toLocaleString();

    return (
        <div className={classes['cart-totals']}>
            <h1>Cart Totals</h1>

            <div className={classes['total-box']}>
                <h3>Subtotal</h3>
                <span className={classes.price}>${formatCartTotal}</span>
            </div>

            <div className={classes['shipping-box']}>
                <h3>Shipping</h3>
                <div className={classes['shipping-content']}>
                    <div className={classes['inputwrapper']}>
                        <div>
                            <label htmlFor="shipping" className="margin-right-a">
                                Shipping Fee: <span>$50</span>
                            </label>
                            <input type="radio" name="contact-pref" id="shipping" value="phone" />
                        </div>

                        <div>
                            <label htmlFor="office">Office Pickup</label>
                            <input type="radio" name="contact-pref" id="office" value="email" />
                        </div>
                    </div>
                    <p className={classes.price}>Shipping to Lagos.</p>
                </div>
            </div>

            <div className={classes.total}>
                <h3>Total</h3>
                <span className={classes.price}>${formatCartTotal}</span>
            </div>

            <Link to="" className={classes['btn-checkout']}>
                Proceed to Checkout
            </Link>
        </div>
    );
};

export default CartTotals;
