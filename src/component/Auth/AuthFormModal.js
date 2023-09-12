import { useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import classes from './AuthFormModal.module.css';

import AuthContext from '../../store/auth-context';
import { appActions } from '../../store/app-slice';
import ButtonSpinner from '../UI/ButtonSpinner';
import Modal from '../UI/Modal';
import icon from '../../assets/sprite.svg';
import { ROARBIKES_API } from '../../lib/api';

const AuthFormModal = (props) => {
    const authCtx = useContext(AuthContext);
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const [formIsValid, setFormIsValid] = useState({
        enteredEmailIsValid: true,
        enteredPasswordIsValid: true,
    });

    const loginUser = (user, token) => {
        authCtx.login(true, user, token);

        setIsLoading(false);
        props.onClose();

        // incase the user only inputs one name
        const userName = user.email.split('@')[0];

        dispatch(
            appActions.setNotification({
                status: 'complete',
                message: `welcome ${userName}`,
            })
        );
    };

    async function exportLocalStoredCarts(user, token) {
        const storedLocalCarts = JSON.parse(localStorage.getItem('cart'));

        // if there is no local stored data or if its empty
        if (!storedLocalCarts || storedLocalCarts.items.length === 0) {
            return loginUser(user, token);
        }

        const filteredStoredCarts = storedLocalCarts.items.map(function (cart) {
            return {
                user: user._id,
                item: cart.item,
                price: cart.price,
                quantity: cart.quantity,
            };
        });

        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/cart/importLocalCartData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(filteredStoredCarts),
            });

            if (!res.ok) throw new Error('Error exporting cart data.');

            loginUser(user, token);
        } catch (err) {
            console.log(err.message);
            loginUser(user, token);
        }
        localStorage.removeItem('cart');
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        // prevent sending multiple request
        if (isLoading) return;

        setError(null);

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        // confirm the validity of the form.
        const enteredEmailIsValid = enteredEmail.includes('@');
        const enteredPasswordIsValid = enteredPassword.length >= 8;

        setFormIsValid({
            enteredEmailIsValid,
            enteredPasswordIsValid,
        });

        // return if the input are invalid
        if (!enteredEmailIsValid || !enteredPasswordIsValid) return;

        setIsLoading(true);
        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/users/login`, {
                method: 'POST',
                body: JSON.stringify({
                    email: enteredEmail,
                    password: enteredPassword,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!res.ok) {
                let errorMessage = 'Failed to loggin user, try again later.';

                let errorData = await res.json();

                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                }

                throw new Error(errorMessage);
            }

            const resData = await res.json();
            const user = resData.data.user;

            // export the cart data to the server and login the user
            exportLocalStoredCarts(user, resData.token);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    // Input styles
    const emailInputClasses = `${!formIsValid.enteredEmailIsValid ? classes['invalid'] : ''}`;
    const passwordInputClasses = `${!formIsValid.enteredPasswordIsValid ? classes['invalid'] : ''}`;

    return (
        <Modal onClose={props.onClose} content="cart" cartIsEnabled={props.showAuth}>
            <div className={classes.head}>
                <h2>Sign in</h2>
                <button className={classes['cancel-btn']} onClick={props.onClose}>
                    <svg className={classes['cancel-icon']}>
                        <use xlinkHref={`${icon}#icon-x`} />
                    </svg>
                </button>
            </div>

            <div className={classes.content}>
                <form className={classes.form} onSubmit={submitHandler}>
                    {error && <div className={classes['error-text']}>{error}</div>}

                    <div className={classes['form-box']}>
                        <label htmlFor="email">Email *</label>
                        <input className={emailInputClasses} type="email" id="email" ref={emailInputRef} />
                        {!formIsValid.enteredEmailIsValid && (
                            <p className={classes.invalidText}>Please enter a valid email address.</p>
                        )}
                    </div>
                    <div className={classes['form-box']}>
                        <label htmlFor="password">Password *</label>
                        <input className={passwordInputClasses} type="password" id="password" ref={passwordInputRef} />
                        {!formIsValid.enteredPasswordIsValid && (
                            <p className={classes.invalidText}>Password must be at least 8 characters.</p>
                        )}
                    </div>
                    <div className={classes['form-box']}>
                        <button>{!isLoading ? 'Log in' : <ButtonSpinner type="white" />}</button>
                    </div>
                    <div className={classes['form-check']}>
                        <div className={classes['check-box']}>
                            <input type="checkbox" id="remember" value="remember" />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <Link to="/">Lost your password?</Link>
                    </div>
                </form>
                <div className={classes['create']}>
                    <div className={classes['create-box']}>
                        <svg className={classes['user-icon']}>
                            <use xlinkHref={`${icon}#icon-user`} />
                        </svg>
                        <p>No account yet?</p>
                    </div>
                    <Link to="/my-account" onClick={props.onClose}>
                        Create an account
                    </Link>
                </div>
            </div>
        </Modal>
    );
};

export default AuthFormModal;
