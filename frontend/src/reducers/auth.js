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
    ADD_FAVORITE_SUCCESS,
    REMOVE_FAVORITE_SUCCESS,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAIL,
    RESET_CHANGE_PASSWORD_SUCCESS,
} from '../actions/types';

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    register_success: false,
    change_password_success: null,
    change_password_message: null,
};

const authReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        case REGISTER_SUCCESS:
            return {
                ...state,
                register_success: true,
            };
        case REGISTER_FAIL:
            return {...state};
        case RESET_REGISTER_SUCCESS:
            return {
                ...state,
                register_success: false,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isAuthenticated: false,
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        case LOGOUT_FAIL:
            return {
                ...state,
            };
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                user: payload.user,
            };
        case LOAD_USER_FAIL:
            return {
                ...state,
                user: null,
            };
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
            };
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        case REFRESH_SUCCESS:
            return {
                ...state,
            };
        case REFRESH_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        case SET_AUTH_LOADING:
            return {
                ...state,
                loading: true,
            };
        case REMOVE_AUTH_LOADING:
            return {
                ...state,
                loading: false,
            };
        case ADD_FAVORITE_SUCCESS:
            return {
                ...state,
                user: {
                    ...state.user,
                    favorites: payload.favorites,
                }
            };
        case REMOVE_FAVORITE_SUCCESS:
            return {
                ...state,
                user: {
                    ...state.user,
                    favorites: payload.favorites,
                }
            };
        case CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                change_password_success: true,
                change_password_message: payload.success,
            };
        case CHANGE_PASSWORD_FAIL:
            return {
                ...state,
                change_password_success: false,
                change_password_message: payload.error,
            };
        case RESET_CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                change_password_success: null,
                change_password_message: null,
            };
        default:
            return state;
    };
};

export default authReducer;