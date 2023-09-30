import { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import classes from './Cart.module.css';
import useHttp from '../../hooks/use-http';

import CartTotals from './CartTotals';
import CartEmpty from './CartEmpty';
import CartItem from './CartItem';
import ItemList from '../item/ItemList';
import CartItemTab from './CartItemTab';
import { getAllItems } from '../../lib/api';

const Cart = () => {
    const cartItems = useSelector((state) => state.cart.items);
    const { sendRequest, status, data: items, error } = useHttp(getAllItems, true);

    useEffect(() => {
        sendRequest('?type=road-bike&limit=4');
    }, [sendRequest]);

    if (cartItems.length === 0) {
        return <CartEmpty />;
    }

    return (
        <Fragment>
            <section className={classes['section__cart--page']}>
                <div className={classes['cart-main']}>
                    <table>
                        <thead>
                            <tr className={classes.head}>
                                <th className={classes['product-remove']}>&nbsp;</th>
                                <th className={classes['product-thumbnail']}>&nbsp;</th>
                                <th className={classes['product-name']}>Product</th>
                                <th className={classes['product-price']}>Price</th>
                                <th className={classes['product-quantity']}>Quantity</th>
                                <th className={classes['product-subtotal']}>subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((cart) => (
                                <CartItem
                                    key={cart.item._id}
                                    itemId={cart.item._id}
                                    id={cart._id}
                                    img={cart.item.imageCover}
                                    name={cart.item.name}
                                    price={cart.price}
                                    quantity={cart.quantity}
                                    itemPriceTotal={cart.itemPriceTotal}
                                />
                            ))}
                        </tbody>
                    </table>

                    {/* note that this shows only on tab -to- mobile viewpoint */}
                    <ul className={classes['cart-tab-list']}>
                        {cartItems.map((cart) => (
                            <CartItemTab
                                key={cart.item._id}
                                itemId={cart.item._id}
                                id={cart._id}
                                img={cart.item.imageCover}
                                name={cart.item.name}
                                price={cart.price}
                                quantity={cart.quantity}
                                itemPriceTotal={cart.itemPriceTotal}
                            />
                        ))}
                    </ul>

                    <div className={classes['coupon-box']}>
                        <input type="text" placeholder="Coupon code" />
                        <button>Apply Coupon</button>
                    </div>
                </div>

                <CartTotals />
            </section>

            <section className="section-items">
                <ItemList status={status} error={error} items={items} isCollection={'optional'} />
            </section>
        </Fragment>
    );
};

export default Cart;
