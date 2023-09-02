import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import classes from './Profile.module.css';
import AuthContext from '../../store/auth-context';

const Profile = () => {
    const authCtx = useContext(AuthContext);

    const logoutHandler = (event) => {
        event.preventDefault();
        authCtx.logout();
    };

    return (
        <section className={classes.profile}>
            <div className={classes['profile-box']}>
                <div className={classes.head}>
                    <h2>My account</h2>
                </div>
                <ul>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? classes.active : '')} to="/my-account">
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? classes.active : '')} to="orders">
                            Orders
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? classes.active : '')} to="addresses">
                            Addresses
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? classes.active : '')} to="payment-method">
                            Payment method
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? classes.active : '')} to="account-settings">
                            Account Details
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? classes.active : '')} to="wishlist">
                            Wishlist
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? classes.active : '')} to="track-order">
                            Track Order
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className={({ isActive }) => (isActive ? classes.active : '')}
                            to="logout"
                            onClick={logoutHandler}
                        >
                            Logout
                        </NavLink>
                    </li>
                </ul>
            </div>

            <Outlet />
        </section>
    );
};

export default Profile;
