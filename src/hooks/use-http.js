import { useCallback, useReducer } from 'react';

const httpReducer = (state, action) => {
    if (action.type === 'SEND') {
        return {
            status: 'pending',
            data: null,
            error: null,
        };
    }

    if (action.type === 'SUCCESS') {
        return {
            status: 'completed',
            data: action.responseData,
            error: null,
        };
    }

    if (action.type === 'ERROR') {
        return {
            status: 'completed',
            data: null,
            error: action.errorMesage,
        };
    }

    // this is for the getItem api route
    if (action.type === 'INVALID') {
        return {
            status: 'invalid',
            data: null,
            error: null,
        };
    }
};

const useHttp = (requestFunction, startWithPending = false) => {
    const [httpState, dispatch] = useReducer(httpReducer, {
        status: startWithPending ? 'pending' : null,
        data: null,
        error: null,
    });

    const sendRequest = useCallback(
        async (requestData) => {
            dispatch({ type: 'SEND' });
            try {
                const responseData = await requestFunction(requestData);
                dispatch({ type: 'SUCCESS', responseData });
            } catch (error) {
                // console.log(error);

                if (error.statusCode === 400) {
                    // this is for the getItem api route
                    return dispatch({
                        type: 'INVALID',
                    });
                }

                dispatch({ type: 'ERROR', errorMesage: 'Unable to load the items. Refresh the page to try again.' });
            }
        },
        [requestFunction]
    );

    return {
        sendRequest,
        ...httpState,
    };
};

export default useHttp;
