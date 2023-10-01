import { useContext } from 'react';
import useCollapsible from '../../hooks/use-collapsible';
import { NavLink } from 'react-router-dom';
import classes from './Menu.module.css';
import Modal from '../UI/Modal';

import AuthContext from '../../store/auth-context';
import icons from '../../assets/sprite.svg';

const Menu = (props) => {
    const authCtx = useContext(AuthContext);
    const { isCollapse: productCollapse, collapseHandler: setProductCollapse } = useCollapsible(false); // Hooks
    const { isCollapse: infoCollapse, collapseHandler: setInfoCollapse } = useCollapsible(false);
    const { isCollapse: contactCollapse, collapseHandler: setContactCollapse } = useCollapsible(false);

    const btnProductCollapse = `${productCollapse ? classes.active : ''}`;
    const productCollapsibleClass = `${productCollapse ? classes['collapsible--expanded'] : ''}`;

    const btnInfoCollapse = `${infoCollapse ? classes.active : ''}`;
    const InfoCollapsibleClass = `${infoCollapse ? classes['collapsible--expanded'] : ''}`;

    const btnContactCollapse = `${contactCollapse ? classes.active : ''}`;
    const contactCollapsibleClass = `${contactCollapse ? classes['collapsible--expanded'] : ''}`;

    const logoutHandler = (event) => {
        event.preventDefault();

        props.onClose();
        authCtx.logout();
    };

    return (
        <Modal onClose={props.onClose} content="menu" menuIsEnabled={props.showMenu}>
            <ul className={classes['menu-list']}>
                <li className={classes['menu-item']}>
                    <NavLink
                        to="/"
                        onClick={props.onClose}
                        className={({ isActive }) => (isActive ? classes.active : '')}
                    >
                        Home
                    </NavLink>
                </li>

                <li className={productCollapsibleClass}>
                    <div className={classes['collapsible__header']}>
                        <h2 className={classes.heading}>Product Categories</h2>
                        <button className={btnProductCollapse} onClick={setProductCollapse}>
                            <svg className={classes['menu-icon']}>
                                <use xlinkHref={`${icons}#icon-keyboard_arrow_right`} />
                            </svg>
                        </button>
                    </div>
                    <ul className={classes['collapsible__content']}>
                        <li className={classes['menu-item']}>
                            <NavLink
                                to="/road-bikes"
                                onClick={props.onClose}
                                className={({ isActive }) => (isActive ? classes.active : '')}
                            >
                                Road Bikes
                            </NavLink>
                        </li>
                        <li className={classes['menu-item']}>
                            <NavLink
                                to="/mountain-bikes"
                                onClick={props.onClose}
                                className={({ isActive }) => (isActive ? classes.active : '')}
                            >
                                Mountain Bikes
                            </NavLink>
                        </li>
                        <li className={classes['menu-item']}>
                            <NavLink
                                to="/folding-bikes"
                                onClick={props.onClose}
                                className={({ isActive }) => (isActive ? classes.active : '')}
                            >
                                Folding Bikes
                            </NavLink>
                        </li>
                    </ul>
                </li>

                <li className={InfoCollapsibleClass}>
                    <div className={classes['collapsible__header']}>
                        <h2 className={classes.heading}>Information</h2>
                        <button className={btnInfoCollapse} onClick={setInfoCollapse}>
                            <svg className={classes['menu-icon']}>
                                <use xlinkHref={`${icons}#icon-keyboard_arrow_right`} />
                            </svg>
                        </button>
                    </div>
                    <ul className={classes['collapsible__content']}>
                        <li className={classes['menu-item']}>
                            <NavLink
                                to="/my-Account"
                                onClick={props.onClose}
                                className={({ isActive }) => (isActive ? classes.active : '')}
                            >
                                My Account
                            </NavLink>
                        </li>
                        <li className={classes['menu-item']}>
                            <NavLink
                                to="/my-Account/track-order"
                                onClick={props.onClose}
                                className={({ isActive }) => (isActive ? classes.active : '')}
                            >
                                Track Order
                            </NavLink>
                        </li>
                        <li className={classes['menu-item']}>
                            <NavLink
                                to="/my-Account/account-settings"
                                onClick={props.onClose}
                                className={({ isActive }) => (isActive ? classes.active : '')}
                            >
                                Account Details
                            </NavLink>
                        </li>
                    </ul>
                </li>

                <li className={contactCollapsibleClass}>
                    <div className={classes['collapsible__header']}>
                        <h2 className={classes.heading}>Customer Care</h2>
                        <button className={btnContactCollapse} onClick={setContactCollapse}>
                            <svg className={classes['menu-icon']}>
                                <use xlinkHref={`${icons}#icon-keyboard_arrow_right`} />
                            </svg>
                        </button>
                    </div>
                    <ul className={classes['collapsible__content']}>
                        <li className={classes['menu-item']}>
                            <NavLink
                                to="/private-policy"
                                onClick={props.onClose}
                                className={({ isActive }) => (isActive ? classes.active : '')}
                            >
                                Private Policy
                            </NavLink>
                        </li>
                        <li className={classes['menu-item']}>
                            <NavLink
                                to="/about"
                                onClick={props.onClose}
                                className={({ isActive }) => (isActive ? classes.active : '')}
                            >
                                About
                            </NavLink>
                        </li>
                        <li className={classes['menu-item']}>
                            <NavLink
                                to="/contact"
                                onClick={props.onClose}
                                className={({ isActive }) => (isActive ? classes.active : '')}
                            >
                                Contact
                            </NavLink>
                        </li>
                    </ul>
                </li>

                <li className={classes['menu-item']}>
                    <NavLink
                        to="/wishlist"
                        onClick={props.onClose}
                        className={({ isActive }) => (isActive ? classes.active : '')}
                    >
                        <svg className={classes['link-icon']}>
                            <use xlinkHref={`${icons}#icon-heart`} />
                        </svg>
                        Wishlist
                    </NavLink>
                </li>

                {!authCtx.userStatus.userIsLoggedIn && (
                    <li className={classes['menu-item']}>
                        <NavLink
                            to="/my-account"
                            onClick={props.onClose}
                            className={({ isActive }) => (isActive ? classes.active : '')}
                        >
                            <svg className={classes['link-icon']}>
                                <use xlinkHref={`${icons}#icon-user`} />
                            </svg>
                            Login / Register
                        </NavLink>
                    </li>
                )}
                {authCtx.userStatus.userIsLoggedIn && (
                    <li className={classes['menu-item']}>
                        <NavLink
                            to="/my-account/logout"
                            onClick={logoutHandler}
                            className={({ isActive }) => (isActive ? classes.active : '')}
                        >
                            <svg className={classes['link-icon']}>
                                <use xlinkHref={`${icons}#icon-user`} />
                            </svg>
                            Logout
                        </NavLink>
                    </li>
                )}
            </ul>
        </Modal>
    );
};

export default Menu;
