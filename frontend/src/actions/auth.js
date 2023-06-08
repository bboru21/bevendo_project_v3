import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    RESET_REGISTER_SUCCESS,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    REFRESH_SUCCESS,
    REFRESH_FAIL,
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAIL,
    RESET_CHANGE_PASSWORD_SUCCESS,
    SEND_PASSWORD_RESET_EMAIL_SUCCESS,
    SEND_PASSWORD_RESET_EMAIL_FAIL,
    RESET_SEND_PASSWORD_RESET_EMAIL_SUCCESS,
} from './types';

export const load_user = () => async dispatch => {
    try {
        const res = await fetch('/api/account/user', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })

        const data = await res.json();

        if (res.status === 200) {
            dispatch({
                type: LOAD_USER_SUCCESS,
                payload: data,
            })
        } else {
            dispatch({
                type: LOAD_USER_FAIL,
            });
        }
    } catch(error) {
        dispatch({
            type: LOAD_USER_FAIL,
        });
    }
};

export const check_auth_status = () => async dispatch => {
    /*
        Could dispatch SET_AUTH_LOADING/REMOVE_AUTH_LOADING here, but since
        this function is called only within request_refresh, we set it there.
    */
    try {
        const res = await fetch('/api/account/verify', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (res.status === 200) {
            dispatch({
                type: AUTHENTICATED_SUCCESS,
            });
            dispatch(load_user());
        } else {
            dispatch({
                type: AUTHENTICATED_FAIL,
            });
        }
    } catch(error) {
        dispatch({
            type: AUTHENTICATED_FAIL,
        });
    }
};

export const request_refresh = () => async dispatch => {

    dispatch({
        type: SET_AUTH_LOADING,
    });

    try {
        const res = await fetch('/api/account/refresh', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (res.status === 200) {
            dispatch({
                type: REFRESH_SUCCESS,
            });
            dispatch(check_auth_status());
        } else {
            dispatch({
                type: REFRESH_FAIL,
            });
        }
    } catch(error) {
        dispatch({
            type: REFRESH_FAIL,
        });
    }

    dispatch({
        type: REMOVE_AUTH_LOADING,
    });
};

export const register = (
    first_name,
    last_name,
    username,
    password,
    re_password,
) => async dispatch => {

    const body = JSON.stringify({
        first_name,
        last_name,
        username,
        password,
        re_password,
    });

    dispatch({
        type: SET_AUTH_LOADING,
    });

    try {
        // technically this could go directly to API
        const res = await fetch('/api/account/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: body,
        });

        if (res.status === 201) {
            dispatch({
                type: REGISTER_SUCCESS
            });
        } else {
            dispatch({
                type: REGISTER_FAIL
            });
        }

    } catch(error) {
        dispatch({
            type: REGISTER_FAIL
        });
    }

    dispatch({
        type: REMOVE_AUTH_LOADING,
    });
};

export const reset_register_success = () => dispatch => {
    dispatch({
        type: RESET_REGISTER_SUCCESS,
    });
};

export const login = (username, password) => async dispatch => {
    const body = JSON.stringify({
        username,
        password,
    });

    dispatch({
        type: SET_AUTH_LOADING,
    });

    try {
        const res = await fetch('/api/account/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: body,
        });

        if (res.status === 200) {
            dispatch({
                type: LOGIN_SUCCESS,
            });
            dispatch(load_user());
        } else {
            dispatch({
                type: LOGIN_FAIL,
            });
        }
    } catch(error) {
        dispatch({
            type: LOGIN_FAIL,
        });
    }

    dispatch({
        type: REMOVE_AUTH_LOADING,
    });
};

export const logout = () => async dispatch => {
    try {
        const res = await fetch('/api/account/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (res.status === 200) {
            dispatch({
                type: LOGOUT_SUCCESS,
            });
        } else {
            dispatch({
                type: LOGOUT_FAIL,
            });
        }
    } catch(error) {
        dispatch({
            type: LOGOUT_FAIL,
        });
    }
};

export const change_password = (
    current_password,
    new_password,
    re_new_password,
) => async dispatch => {

    const body = JSON.stringify({
        current_password,
        new_password,
        re_new_password,
    });

    try {

        const res = await fetch('/api/account/change-password', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body,
        });

        const data = await res.json();

        if (res.status === 200) {
            dispatch({
                type: CHANGE_PASSWORD_SUCCESS,
                payload: data,
            });
        } else {
            dispatch({
                type: CHANGE_PASSWORD_FAIL,
                payload: data,
            });
        }
    }
    catch(error) {
        dispatch({
            type: CHANGE_PASSWORD_FAIL,
            payload: {'error': 'Something went wrong when changing password'}
        });
    }
};

export const reset_change_password_success = () => dispatch => {
    dispatch({
        type: RESET_CHANGE_PASSWORD_SUCCESS,
    });
};

export const send_password_reset_email = (email) => async dispatch => {
    const body = JSON.stringify({
        email
    });

    try {
        const res = await fetch('/api/account/send-password-reset-email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body,
        });

        const data = await res.json();

        if (res.status === 200) {
            dispatch({
                type: SEND_PASSWORD_RESET_EMAIL_SUCCESS,
                payload: data,
            });
        } else {
            dispatch({
                type: SEND_PASSWORD_RESET_EMAIL_FAIL,
                payload: data,
            });
        }
    } catch(error) {
        dispatch({
            type: SEND_PASSWORD_RESET_EMAIL_FAIL,
            payload: {'error': 'Something went wrong when attempting to send password reset email'},
        });
    }
};

export const reset_send_password_reset_email_success = () => dispatch => {
    dispatch({
        type: RESET_SEND_PASSWORD_RESET_EMAIL_SUCCESS,
    });
};
