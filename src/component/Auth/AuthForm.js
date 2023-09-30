import { useState, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classes from './AuthForm.module.css';
import ButtonSpinner from '../UI/ButtonSpinner';

import { appActions } from '../../store/app-slice';
import { ROARBIKES_API } from '../../lib/api';
import { useDispatch } from 'react-redux';
import AuthContext from '../../store/auth-context';
import { exportLocalSavedItems } from '../../lib/api';

const AuthForm = () => {
    const authCtx = useContext(AuthContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const nameInputRef = useRef();
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const passwordConfirmInputRef = useRef();

    const [formIsValid, setFormIsValid] = useState({
        enteredNameIsValid: true,
        enteredEmailIsValid: true,
        enteredPasswordIsValid: true,
        enteredPasswordConfirmIsValid: true,
    });

    const loginUser = (user, token) => {
        authCtx.login(true, user, token);

        setIsLoading(false);
        navigate('/');

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
                item: cart.item._id, // item mongodb id
                price: cart.price,
                quantity: cart.quantity,
            };
        });

        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/cart/importLocalCartData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(filteredStoredCarts),
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Error exporting cart data.');

            await exportLocalSavedItems(user._id, token);
        } catch (err) {
            console.log(err.message);
        }
        loginUser(user, token);
        localStorage.removeItem('cart');
        localStorage.removeItem('savedItems');
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);

        // prevent sending multiple request
        if (isLoading) return;

        let enteredName = '';
        let enteredPasswordConfirm = '';

        if (!isLogin) {
            // sign up state
            enteredName = nameInputRef.current.value;
            enteredPasswordConfirm = passwordConfirmInputRef.current.value;
        }

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        const enteredNameIsValid = enteredName.length >= 5; // returns false if state "isLogin" is truthy
        const enteredEmailIsValid = enteredEmail.includes('@');
        const enteredPasswordIsValid = enteredPassword.length >= 8;
        const enteredPasswordConfirmIsValid = enteredPasswordConfirm.length >= 8; // returns false if state "isLogin" is truthy

        setFormIsValid({
            enteredNameIsValid,
            enteredEmailIsValid,
            enteredPasswordIsValid,
            enteredPasswordConfirmIsValid,
        });

        // if all the 4 fields are valid
        let formContentIsValid;
        let apiRoute;
        let formData = {};

        if (!isLogin) {
            // if all the 4 fields are valid
            formContentIsValid =
                enteredNameIsValid && enteredEmailIsValid && enteredPasswordIsValid && enteredPasswordConfirmIsValid;

            apiRoute = `${ROARBIKES_API}/api/v1/users/signup`;
            formData = {
                name: enteredName,
                email: enteredEmail,
                password: enteredPassword,
                passwordConfirm: enteredPasswordConfirm,
            };
        } else {
            // if 2 fields are valid
            formContentIsValid =
                !enteredNameIsValid && enteredEmailIsValid && enteredPasswordIsValid && !enteredPasswordConfirmIsValid;

            apiRoute = `${ROARBIKES_API}/api/v1/users/login`;
            formData = {
                email: enteredEmail,
                password: enteredPassword,
            };
        }

        if (!formContentIsValid) return;

        setIsLoading(true);
        try {
            const res = await fetch(apiRoute, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!res.ok) {
                let errorMessage = isLogin
                    ? 'Failed to loggin user, try again later.'
                    : 'Failed to create user, try again later.';

                let errorData = await res.json();

                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                }

                throw new Error(errorMessage);
            }

            const resData = await res.json();
            const user = resData.data.user;

            // export the saved cart data to the server and Login the user
            exportLocalStoredCarts(user, resData.token);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    // Input styles
    const nameInputClasses = `${!formIsValid.enteredNameIsValid ? classes['invalid'] : ''}`;
    const emailInputClasses = `${!formIsValid.enteredEmailIsValid ? classes['invalid'] : ''}`;
    const passwordInputClasses = `${!formIsValid.enteredPasswordIsValid ? classes['invalid'] : ''}`;
    const passwordConfirmInputClasses = `${!formIsValid.enteredPasswordConfirmIsValid ? classes['invalid'] : ''}`;

    return (
        <section className={classes.auth}>
            <div className={classes['auth-box']}>
                <div className={classes.head}>
                    <h2>{isLogin ? 'Login' : 'Register'}</h2>
                </div>
                {error && <div className={classes['error-text']}>* {error}</div>}
                <div className={classes.content}>
                    <form className={classes.form} onSubmit={submitHandler}>
                        {!isLogin && (
                            <div className={classes['form-box']}>
                                <label htmlFor="name">Name *</label>
                                <input className={nameInputClasses} type="text" id="name" ref={nameInputRef} />
                                {!formIsValid.enteredNameIsValid && (
                                    <p className={classes.invalidText}>Your name must be at least 5 characters.</p>
                                )}
                            </div>
                        )}
                        <div className={classes['form-box']}>
                            <label htmlFor="email">Email address *</label>
                            <input className={emailInputClasses} type="email" id="email" ref={emailInputRef} />
                            {!formIsValid.enteredEmailIsValid && (
                                <p className={classes.invalidText}>Please enter a valid email address.</p>
                            )}
                        </div>
                        <div className={classes['form-box']}>
                            <label htmlFor="password">Password *</label>
                            <input
                                className={passwordInputClasses}
                                type="password"
                                id="password"
                                ref={passwordInputRef}
                            />
                            {!formIsValid.enteredPasswordIsValid && (
                                <p className={classes.invalidText}>Password must be at least 8 characters.</p>
                            )}
                        </div>
                        {!isLogin && (
                            <div className={classes['form-box']}>
                                <label htmlFor="passwordConfirm">Confirm password *</label>
                                <input
                                    className={passwordConfirmInputClasses}
                                    type="password"
                                    id="passwordConfirm"
                                    ref={passwordConfirmInputRef}
                                />
                                {!formIsValid.enteredPasswordConfirmIsValid && (
                                    <p className={classes.invalidText}>Password must be at least 8 characters.</p>
                                )}
                            </div>
                        )}
                        {!isLogin && (
                            <div className={classes['form-box']}>
                                <p>
                                    Your personal data will be used to support your experience throughout this website,
                                    to manage access to your account, and for other purposes described in our{' '}
                                    <Link to="/private-policy">privacy policy.</Link>
                                </p>
                            </div>
                        )}
                        <div className={classes['form-box']}>
                            {!isLoading && <button>{isLogin ? 'log in' : 'Register'}</button>}
                            {isLoading && (
                                <button>
                                    <ButtonSpinner type="white" />
                                </button>
                            )}
                        </div>
                        {isLogin && ( // login
                            <div className={classes['form-check']}>
                                <div className={classes['check-box']}>
                                    <input type="checkbox" id="remember" value="remember" />
                                    <label htmlFor="remember">Remember me</label>
                                </div>
                                <Link to="/">Lost your password?</Link>
                            </div>
                        )}
                    </form>
                </div>
            </div>
            <div className={classes['auth-box']}>
                <div className={classes['border']}>
                    <span className={classes['border-left']}></span>
                    <span className={classes['register']}>or</span>
                    <span className={classes['border-right']}></span>
                </div>
                <h2 className={classes['auth-head']}>Register</h2>
                <div className={classes['content-register']}>
                    <p>
                        Registering for this site allows you to access your order status and history. Just fill in the
                        fields below, and we'll get a new account set up for you in no time. We will only ask you for
                        information necessary to make the purchase process faster and easier.
                    </p>
                    <button onClick={switchAuthModeHandler}>{isLogin ? 'Register' : 'Login'}</button>
                </div>
            </div>
        </section>
    );
};

export default AuthForm;
