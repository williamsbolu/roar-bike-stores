import { useContext, useEffect } from 'react';
import classes from './Profile.module.css';
import { Link } from 'react-router-dom';
import useHttp from '../../hooks/use-http';
import { getUserData } from '../../lib/api';

import AuthContext from '../../store/auth-context';
import icon from '../../assets/sprite.svg';
import LoadingSpinner from '../UI/LoadingSpinner';

const Dashboard = (props) => {
    const { sendRequest, status, data: userData, error: errorMessage } = useHttp(getUserData, true);
    const authCtx = useContext(AuthContext);

    // this effect runs and gets the user data by accepting the token as payload
    useEffect(() => {
        sendRequest(authCtx.userStatus.userToken);
    }, [authCtx.userStatus.userToken, sendRequest]);

    let displayName = '';

    if (userData) {
        // displayName = userData.name.split(' ')[0] ? userData.name.split(' ')[0] : userData.name;
        displayName = userData.email.split('@')[0];
    }

    const logoutHandler = (e) => {
        e.preventDefault();
        authCtx.logout();
    };

    return (
        <div className={classes['profile-box']}>
            {userData && status === 'completed' && (
                <div>
                    <p>
                        Hello <span>{displayName}</span>
                    </p>
                    <p>
                        From your account dashboard you can view your recent orders, manage your shipping and billing
                        addresses, and <Link to="account-settings">edit your password and account details.</Link>
                    </p>
                    <div className={classes['box-items']}>
                        <Link to="orders" className={classes['box']}>
                            <svg>
                                <use xlinkHref={`${icon}#icon-file-text`} />
                            </svg>
                            <h3>Orders</h3>
                        </Link>
                        <Link to="addresses" className={classes['box']}>
                            <svg>
                                <use xlinkHref={`${icon}#icon-map-pin`} />
                            </svg>
                            <h3>Addresses</h3>
                        </Link>
                        <Link to="payment-method" className={classes['box']}>
                            <svg>
                                <use xlinkHref={`${icon}#icon-credit-card`} />
                            </svg>
                            <h3>Payment method</h3>
                        </Link>
                        <Link to="account-settings" className={classes['box']}>
                            <svg>
                                <use xlinkHref={`${icon}#icon-user`} />
                            </svg>
                            <h3>Account Details</h3>
                        </Link>
                        <Link to="wishlist" className={classes['box']}>
                            <svg>
                                <use xlinkHref={`${icon}#icon-heart`} />
                            </svg>
                            <h3>Wishlist</h3>
                        </Link>
                        <Link to="track-order" className={classes['box']}>
                            <svg>
                                <use xlinkHref={`${icon}#icon-globe`} />
                            </svg>
                            <h3>Track Order</h3>
                        </Link>
                        <Link to="logout" className={classes['box']} onClick={logoutHandler}>
                            <svg>
                                <use xlinkHref={`${icon}#icon-log-out`} />
                            </svg>
                            <h3>Logout</h3>
                        </Link>
                    </div>
                </div>
            )}
            {status === 'pending' && !userData && (
                <div className="centered">
                    <LoadingSpinner />
                </div>
            )}
            {errorMessage && (
                <div className="centered">
                    <p>Error Loading user data!</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
