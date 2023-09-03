import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { appActions } from './app-slice';
import { ROARBIKES_API } from '../lib/api';

const AuthContext = React.createContext({
    userStatus: {
        userIsLoggedIn: false,
        userToken: '', // delete later
        userName: '',
        userEmail: '',
        userRole: '',
    },
    login: () => {},
    logout: () => {},
});

export const AuthContextProvider = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userStatus, setUserStatus] = useState({
        userIsLoggedIn: false,
        userToken: '', // delete later
        userName: '',
        userEmail: '',
        userRole: '',
    });

    const loginHandler = (loggedInStatus, user, token) => {
        setUserStatus({
            userIsLoggedIn: loggedInStatus,
            userToken: token, // delete later
            userName: user.name,
            userEmail: user.email,
            userRole: user.role,
        });
    };

    const logoutHandler = async () => {
        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/users/logout`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('Something went wrong, try again later!');
            }

            setUserStatus({
                userIsLoggedIn: false,
                userName: '',
                userEmail: '',
            });

            // notify the user
            dispatch(
                appActions.setNotification({
                    status: 'complete',
                    message: 'logged out user',
                })
            );

            navigate('/');
        } catch (error) {
            dispatch(
                appActions.setNotification({
                    status: 'error',
                    message: error.message,
                })
            );
        }
    };

    const getLoggedStatus = useCallback(async () => {
        try {
            const res = await fetch(`${ROARBIKES_API}/api/v1/users/getLoggedInStatus`, {
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to get user login status!');

            const data = await res.json();

            console.log(data);

            // if the user is loggedin from the status received
            if (data.isLoggedIn) loginHandler(data.isLoggedIn, data.user);
        } catch (err) {
            console.log(err);
            return;
        }
    }, []);

    useEffect(() => {
        getLoggedStatus();
    }, [getLoggedStatus]);

    const contextValue = {
        userStatus,
        login: loginHandler,
        logout: logoutHandler,
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
