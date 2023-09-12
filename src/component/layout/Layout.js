import { Fragment, useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AuthContext from '../../store/auth-context';
import Navigation from './Navigation';
import Notification from '../UI/Notification';
import CartModal from '../cart/CartModal';
import AuthFormModal from '../Auth/AuthFormModal';
import Footer from './Footer';
import { getCartData } from '../../store/cart-actions';
import { cartActions } from '../../store/cart-slice';
import { appActions } from '../../store/app-slice';

import styles from './Layout.module.css';

let isInitial = true;
let isLoaded = true;

const Layout = (props) => {
    const authCtx = useContext(AuthContext);
    const dispatch = useDispatch();
    const notification = useSelector((state) => state.app.notification);
    const cart = useSelector((state) => state.cart);

    const [showAuth, setShowAuth] = useState(false);
    const [showCart, setShowCart] = useState(false);
    // const [showMenu, setShowMenu] = useState(false);

    // console.log(cart);

    const disableNotificationHandler = () => {
        dispatch(appActions.setNotification(null));
    };

    // this effect runs to update the cart data when the user is not authenticated
    useEffect(() => {
        if (authCtx.userStatus.userIsLoggedIn) return;

        const storedCartData = JSON.parse(localStorage.getItem('cart'));

        if (storedCartData) {
            dispatch(cartActions.replaceCart(storedCartData));
        }
    }, [dispatch, authCtx.userStatus.userIsLoggedIn]);

    // this effect runs to update the cart data when the user is authenticated(logged in)
    useEffect(() => {
        if (authCtx.userStatus.userIsLoggedIn) {
            dispatch(getCartData(authCtx.userStatus.userToken));
        }
    }, [authCtx.userStatus, dispatch]);

    useEffect(() => {
        if (isLoaded) {
            // so it dosen't work when the page is loaded for d first time
            isLoaded = false;
            return;
        }

        function updateNotification() {
            dispatch(
                appActions.setNotification({
                    status: 'complete',
                    message: `Cart updated sucessfully`,
                })
            );
        }

        // if d user is not loggedIn && changed means when d user himself has interacted with d cart
        if (!authCtx.userStatus.userIsLoggedIn && cart.changed) {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateNotification();
        } else if (authCtx.userStatus.userIsLoggedIn && cart.changed) {
            updateNotification();
        }
    }, [cart, authCtx.userStatus.userIsLoggedIn, dispatch]);

    useEffect(() => {
        // this effect runs whenever there's a notification
        if (isInitial) {
            // remember it dosent work here
            isInitial = false;
            return;
        }

        const timer = setTimeout(() => {
            dispatch(appActions.setNotification(null));
        }, 4000);

        return () => {
            clearTimeout(timer);
        };
    }, [notification, dispatch]);

    const switchAuthDisplayHandler = () => {
        setShowAuth((prevState) => !prevState);
    };
    const switchCartDisplayHandler = () => {
        setShowCart((prevState) => !prevState);
    };

    return (
        <Fragment>
            <CartModal showCart={showCart} onClose={switchCartDisplayHandler} />
            {!authCtx.userStatus.userIsLoggedIn && (
                <AuthFormModal showAuth={showAuth} onClose={switchAuthDisplayHandler} />
            )}
            <header className={styles.header}>
                {notification && (
                    <Notification
                        status={notification.status}
                        message={notification.message}
                        onClose={disableNotificationHandler}
                    />
                )}
                <Navigation onShowAuth={switchAuthDisplayHandler} onShowCart={switchCartDisplayHandler} />
            </header>
            <main>{props.children}</main>
            <footer>
                <Footer />
            </footer>
        </Fragment>
    );
};

export default Layout;
