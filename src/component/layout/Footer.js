import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import classes from './Footer.module.css';

const Footer = () => {
    return (
        <Fragment>
            <div className={classes['footer__main']}>
                <div className={classes['footer-box']}>
                    <h1>Roar Bikes</h1>
                    {/* <p className={classes['footer-text']}>Designed and Developed by Williams</p> */}
                </div>

                <div className={classes['footer-box']}>
                    <h3>Find It Fast</h3>

                    <ul className="footer-list">
                        <li>
                            <Link to="/my-account/orders">Order</Link>
                        </li>
                        <li>
                            <Link to="/my-account/account-settings">Account</Link>
                        </li>
                        <li>
                            <Link to="/my-account/account-settings">Change Password</Link>
                        </li>
                    </ul>
                </div>

                <div className={classes['footer-box']}>
                    <h3>Informations</h3>

                    <ul className="footer-list">
                        <li>
                            <Link to="/my-account">My Account</Link>
                        </li>
                        <li>
                            <Link to="/my-account/orders">Track Your Order</Link>
                        </li>
                        <li>
                            <Link to="/my-account/payment-method">Payment Method</Link>
                        </li>
                    </ul>
                </div>

                <div className={classes['footer-box']}>
                    <h3>Customer Care</h3>

                    <ul className="footer-list">
                        <li>
                            <Link to="/private-policy">Private Policy</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/contact">Contact</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={classes['footer-copywright']}>
                <div className={classes['content']}>
                    <p>&copy; Roar Bikes 2022 .</p>
                </div>
            </div>
        </Fragment>
    );
};

export default Footer;
