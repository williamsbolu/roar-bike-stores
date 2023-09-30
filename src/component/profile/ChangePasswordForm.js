import { useRef, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import classes from './AccountSettings.module.css';

import AuthContext from '../../store/auth-context';
import { appActions } from '../../store/app-slice';
import ButtonFormSpinner from '../UI/ButtonFormSpinner';
import { ROARBIKES_API } from '../../lib/api';

const ChangePasswordForm = () => {
    // const authCtx = useContext(AuthContext);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const [passwordFormIsValid, setPasswordFormIsValid] = useState({
        enteredCurrentPasswordIsValid: true,
        enteredPasswordIsValid: true,
        enteredPasswordConfirmIsValid: true,
    });

    const CurrentPasswordInputRef = useRef();
    const passwordInputRef = useRef();
    const passwordConfirmInputRef = useRef();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (isLoading) return; // stops multiple request

        const enteredCurrentPassword = CurrentPasswordInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        const enteredPasswordConfirm = passwordConfirmInputRef.current.value;

        // confirm validity
        const enteredCurrentPasswordIsValid = enteredCurrentPassword.length >= 8;
        const enteredPasswordIsValid = enteredPassword.length >= 8;
        const enteredPasswordConfirmIsValid = enteredPasswordConfirm.length >= 8;

        setPasswordFormIsValid({
            enteredCurrentPasswordIsValid,
            enteredPasswordIsValid,
            enteredPasswordConfirmIsValid,
        });

        const formContentIsValid =
            enteredCurrentPasswordIsValid && enteredPasswordIsValid && enteredPasswordConfirmIsValid;

        if (!formContentIsValid) return;

        setIsLoading(true);
        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/users/updateMyPassword`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    passwordCurrent: enteredCurrentPassword,
                    password: enteredPassword,
                    passwordConfirm: enteredPasswordConfirm,
                }),
                credentials: 'include',
            });

            if (!res.ok) {
                let errorMessage = 'Error updating your password!';

                const errorData = await res.json();

                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                }

                throw new Error(errorMessage);
            }

            dispatch(
                appActions.setNotification({
                    status: 'complete',
                    message: `Password updated sucessfully.`,
                })
            );
        } catch (err) {
            dispatch(
                appActions.setNotification({
                    status: 'error',
                    message: err.message,
                })
            );
        }
        setIsLoading(false);
    };

    return (
        <form className={classes['form']} onSubmit={submitHandler}>
            <h2>Password Change</h2>

            <div className={classes['form-box']}>
                <label htmlFor="password">Current password</label>
                <input
                    className={!passwordFormIsValid.enteredCurrentPasswordIsValid ? classes.invalid : ''}
                    type="password"
                    id="password"
                    ref={CurrentPasswordInputRef}
                />
                {!passwordFormIsValid.enteredCurrentPasswordIsValid && (
                    <p className={classes.invalidText}>Password must be at least 8 characters.</p>
                )}
            </div>
            <div className={classes['form-box']}>
                <label htmlFor="new-password">New password</label>
                <input
                    className={!passwordFormIsValid.enteredPasswordIsValid ? classes.invalid : ''}
                    type="password"
                    id="new-password"
                    ref={passwordInputRef}
                />
                {!passwordFormIsValid.enteredPasswordIsValid && (
                    <p className={classes.invalidText}>Password must be at least 8 characters.</p>
                )}
            </div>
            <div className={classes['form-box']}>
                <label htmlFor="confirm-password">Confirm new password</label>
                <input
                    className={!passwordFormIsValid.enteredPasswordConfirmIsValid ? classes.invalid : ''}
                    type="password"
                    id="confirm-password"
                    ref={passwordConfirmInputRef}
                />
                {!passwordFormIsValid.enteredPasswordConfirmIsValid && (
                    <p className={classes.invalidText}>Password must be at least 8 characters.</p>
                )}
            </div>
            <div className={classes['form-box']}>
                <button>{isLoading ? <ButtonFormSpinner /> : 'Change Password'}</button>
            </div>
        </form>
    );
};

export default ChangePasswordForm;
