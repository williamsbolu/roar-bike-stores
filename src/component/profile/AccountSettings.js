import { useEffect, useContext, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useHttp from '../../hooks/use-http';
import classes from './AccountSettings.module.css';
import ChangePasswordForm from './ChangePasswordForm';
import AuthContext from '../../store/auth-context';

import { appActions } from '../../store/app-slice';
import { getUserData, ROARBIKES_API } from '../../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import ButtonFormSpinner from '../UI/ButtonFormSpinner';

const AccountDetails = () => {
    const { sendRequest, status, data: userData, error: errorMessage } = useHttp(getUserData, true);
    const authCtx = useContext(AuthContext);
    const [updateInProgress, setUpdateInProgress] = useState(false);
    const dispatch = useDispatch();

    const nameInputRef = useRef();
    const emailInputRef = useRef();

    const [updateFormIsValid, setUpdateFormIsValid] = useState({
        enteredNameIsValid: true,
        enteredEmailIsValid: true,
    });

    // this effect runs and gets the user data by accepting the token as payload
    useEffect(() => {
        sendRequest(authCtx.userStatus.userToken);
    }, [authCtx.userStatus.userToken, sendRequest]);

    const updateUserHandler = async (e) => {
        e.preventDefault();

        if (updateInProgress) return; // stops multiple request

        const enteredName = nameInputRef.current.value;
        const enteredEmail = emailInputRef.current.value;

        // confirm validity
        const enteredNameIsValid = enteredName.length >= 5;
        const enteredEmailIsValid = enteredEmail.includes('@');

        setUpdateFormIsValid({
            enteredNameIsValid,
            enteredEmailIsValid,
        });

        if (!enteredNameIsValid || !enteredEmailIsValid) return;

        setUpdateInProgress(true);
        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/users/updateMe`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: enteredName,
                    email: enteredEmail,
                }),
                credentials: 'include',
            });

            if (!res.ok) {
                let errorMessage = 'Error updating user data!';

                const errorData = await res.json();

                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                }

                throw new Error(errorMessage);
            }

            dispatch(
                appActions.setNotification({
                    status: 'complete',
                    message: `User details updated.`,
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
        setUpdateInProgress(false);
    };

    let displayName = '';

    if (userData) {
        displayName = userData.email.split('@');
    }

    return (
        <div className={classes['user-details']}>
            {userData && status === 'completed' && (
                <div>
                    <form className={classes.form} onSubmit={updateUserHandler}>
                        <div className={classes['form-box']}>
                            <div className={classes['box-item']}>
                                <label htmlFor="name">User name *</label>
                                <input
                                    className={!updateFormIsValid.enteredNameIsValid ? classes.invalid : ''}
                                    type="text"
                                    id="name"
                                    defaultValue={userData.name}
                                    ref={nameInputRef}
                                />
                                {!updateFormIsValid.enteredNameIsValid && (
                                    <p className={classes.invalidText}>Your name must be at least 5 characters.</p>
                                )}
                            </div>
                            <div className={classes['box-item']}>
                                <label htmlFor="lastname">Lastname *</label>
                                <input type="text" id="lastname" />
                            </div>
                        </div>
                        <div className={classes['form-box']}>
                            <label htmlFor="displayName">Display name *</label>
                            <input type="text" id="displayName" defaultValue={displayName[0]} />
                            <p className={classes.info}>
                                This will be how your name will be displayed in the account section and in reviews
                            </p>
                        </div>
                        <div className={classes['form-box']}>
                            <label htmlFor="email">Email Address *</label>
                            <input
                                className={!updateFormIsValid.enteredEmailIsValid ? classes.invalid : ''}
                                type="email"
                                id="email"
                                defaultValue={userData.email}
                                ref={emailInputRef}
                            />
                            {!updateFormIsValid.enteredEmailIsValid && (
                                <p className={classes.invalidText}>Please enter a valid email address.</p>
                            )}
                        </div>
                        <button>{updateInProgress ? <ButtonFormSpinner /> : 'Save changes'}</button>
                    </form>
                    <ChangePasswordForm />
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

export default AccountDetails;
