import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Navigation from './Navigation';
import Notification from '../UI/Notification';
import AuthFormModal from '../Auth/AuthFormModal';
import Footer from './Footer';
import { appActions } from '../../store/app-slice';

import styles from './Layout.module.css';

// let isInitial = true;
// let isLoaded = true;

const Layout = (props) => {
    const dispatch = useDispatch();
    const notification = useSelector((state) => state.app.notification);

    // const [showCart, setShowCart] = useState(false);
    // const [showMenu, setShowMenu] = useState(false);
    const [showAuth, setShowAuth] = useState(false);

    const disableNotificationHandler = () => {
        dispatch(appActions.setNotification(null));
    };

    useEffect(() => {
        // this effect runs whenever there's a notification and when the cart changes
        // if (isInitial) {
        //     // remember it dosent work here
        //     isInitial = false;
        //     return;
        // }

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

    return (
        <Fragment>
            <AuthFormModal showAuth={showAuth} onClose={switchAuthDisplayHandler} />
            <header className={styles.header}>
                {notification && (
                    <Notification
                        status={notification.status}
                        message={notification.message}
                        onClose={disableNotificationHandler}
                    />
                )}
                <Navigation onShowAuth={switchAuthDisplayHandler} />
            </header>
            <main>{props.children}</main>
            <footer>
                <Footer />
            </footer>
        </Fragment>
    );
};

export default Layout;
