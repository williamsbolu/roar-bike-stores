import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from '../UI/Modal';
import CartModalItem from './CartModalItem';
import classes from './CartModal.module.css';

import icon from '../../assets/sprite.svg';

const CartModal = (props) => {
    const cartItems = useSelector((state) => state.cart.items);
    const cartTotalAmount = useSelector((state) => state.cart.totalAmount);

    const formattedCartTotal = cartTotalAmount.toLocaleString();
    // console.log(cartItems);

    return (
        <Modal onClose={props.onClose} content="cart" cartIsEnabled={props.showCart}>
            <div className={classes.head}>
                <h2>Shopping Cart</h2>
                <button className={classes['cancel-btn']} onClick={props.onClose}>
                    <svg className={classes['cancel-icon']}>
                        <use xlinkHref={`${icon}#icon-x`} />
                    </svg>
                </button>
            </div>

            <div className={classes.content}>
                <ul>
                    {cartItems.map((cart) => (
                        <CartModalItem
                            key={cart.item._id}
                            itemId={cart.item._id}
                            id={cart._id}
                            img={cart.item.imageCover}
                            name={cart.item.name}
                            price={cart.price}
                            quantity={cart.quantity}
                            itemPriceTotal={cart.itemPriceTotal}
                            onClick={props.onClose}
                        />
                    ))}
                </ul>

                {cartItems.length === 0 && (
                    <div className={classes['no-cart']}>
                        <div className={classes['no-cart--box']}>
                            <svg className={classes['icon-nocart']}>
                                <use xlinkHref={`${icon}#icon-remove_shopping_cart`} />
                            </svg>
                            <p>No products in the cart.</p>
                        </div>

                        <button onClick={props.onClose}>Return to shop</button>
                    </div>
                )}
            </div>

            {cartItems.length > 0 && (
                <div className={classes.total}>
                    <div className={classes['total--box']}>
                        <h3>Subtotal:</h3>
                        <span>${formattedCartTotal}</span>
                    </div>
                    <Link onClick={props.onClose} to="/cart">
                        View Cart
                    </Link>
                    <Link onClick={props.onClose} to="/checkout">
                        Checkout
                    </Link>
                </div>
            )}
        </Modal>
    );
};

export default CartModal;
