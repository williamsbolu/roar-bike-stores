import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

import styles from './Navigation.module.css';
import icons from '../../assets/sprite.svg';

const Navigation = (props) => {
    const authCtx = useContext(AuthContext);
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);

    const showAuthHandler = (e) => {
        if (!authCtx.userStatus.userIsLoggedIn) {
            e.preventDefault();
            props.onShowAuth();
        }
    };

    return (
        <nav className={styles.nav}>
            <button className={styles['menu-btn']} onClick={props.onShowMenu}>
                <svg className={styles['menu-icon']}>
                    <use xlinkHref={`${icons}#icon-menu`} />
                </svg>
                <span>menu</span>
            </button>

            <h1>Roar Bikes</h1>

            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : '')}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/road-bikes" className={({ isActive }) => (isActive ? styles.active : '')}>
                        Road bikes
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mountain-bikes" className={({ isActive }) => (isActive ? styles.active : '')}>
                        Mountain bikes
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/folding-bikes" className={({ isActive }) => (isActive ? styles.active : '')}>
                        Folding bikes
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/contact" className={({ isActive }) => (isActive ? styles.active : '')}>
                        Contact
                    </NavLink>
                </li>
            </ul>

            <div className={styles['user-icons-box']}>
                <Link to="/my-account" className={styles['user-btn']} onClick={showAuthHandler}>
                    <svg className={styles['nav-icon']}>
                        <use xlinkHref={`${icons}#icon-user`} />
                    </svg>
                </Link>

                <button className={styles['user-btn']}>
                    <svg className={styles['nav-icon']}>
                        <use xlinkHref={`${icons}#icon-heart`} />
                    </svg>
                    <span className={styles['nav-icon__notification']}>5</span>
                </button>

                <button className={styles['user-btn']} onClick={props.onShowCart}>
                    <svg className={styles['nav-icon']}>
                        <use xlinkHref={`${icons}#icon-shopping-cart`} />
                    </svg>
                    <span className={styles['nav-icon__notification']}>{totalQuantity}</span>
                </button>
            </div>
        </nav>
    );
};

export default Navigation;
