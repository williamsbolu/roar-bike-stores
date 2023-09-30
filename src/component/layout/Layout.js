import { Fragment, useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Layout.module.css';

import AuthContext from '../../store/auth-context';
import Menu from '../menu/Menu';
import Navigation from './Navigation';
import Notification from '../UI/Notification';
import CartModal from '../cart/CartModal';
import AuthFormModal from '../Auth/AuthFormModal';
import Footer from './Footer';
import { getCartData } from '../../store/cart-actions';
import { getWishlistData } from '../../store/wishlist-actions';
import { cartActions } from '../../store/cart-slice';
import { appActions } from '../../store/app-slice';
import { wishListActions } from '../../store/wishlist-slice';

let isInitial = true;
let isLoaded = true;

const Layout = (props) => {
    const authCtx = useContext(AuthContext);
    const dispatch = useDispatch();
    const notification = useSelector((state) => state.app.notification);
    const cart = useSelector((state) => state.cart);
    const wishlist = useSelector((state) => state.wishlist);

    const [showAuth, setShowAuth] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const disableNotificationHandler = () => {
        dispatch(appActions.setNotification(null));
    };

    // this effect runs to update the cart data when the user is loggedin or not
    useEffect(() => {
        if (!authCtx.userStatus.userIsLoggedIn) {
            const storedCartData = JSON.parse(localStorage.getItem('cart'));

            // if we have have stored cart items in our storage and it is not empty
            if (storedCartData && storedCartData.items.length > 0) {
                dispatch(cartActions.replaceCart(storedCartData));
            }
        } else {
            dispatch(getCartData(authCtx.userStatus.userToken));
        }
    }, [dispatch, authCtx.userStatus]);

    useEffect(() => {
        if (!authCtx.userStatus.userIsLoggedIn) {
            const storedSaveItems = JSON.parse(localStorage.getItem('savedItems'));

            // if we have have stored items in our storage and it is not empty
            if (storedSaveItems && storedSaveItems.items.length > 0) {
                dispatch(wishListActions.replaceItems(storedSaveItems));
            }
        } else {
            dispatch(getWishlistData(authCtx.userStatus.userToken));
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
    }, [cart, authCtx.userStatus, dispatch]);

    useEffect(() => {
        if (isInitial) {
            isInitial = false;
            return;
        }

        // Only when d user is not logged in, we store here
        if (!authCtx.userStatus.userIsLoggedIn) {
            localStorage.setItem('savedItems', JSON.stringify(wishlist));
        }
    }, [authCtx.userStatus, wishlist]);

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
    const switchMenuDisplayHandler = () => {
        setShowMenu((prevState) => !prevState);
    };

    return (
        <Fragment>
            <CartModal showCart={showCart} onClose={switchCartDisplayHandler} />
            <Menu showMenu={showMenu} onClose={switchMenuDisplayHandler} />
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
                <Navigation
                    onShowMenu={switchMenuDisplayHandler}
                    onShowAuth={switchAuthDisplayHandler}
                    onShowCart={switchCartDisplayHandler}
                />
            </header>
            <main>{props.children}</main>
            <footer>
                <Footer />
            </footer>
        </Fragment>
    );
};

export default Layout;
