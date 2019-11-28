import {
    USER_AUTHENTICATED,
    USER_LOGGED_OUT,
    LOGIN_ERROR,
    CLEAR_AUTH_ERROR,
} from "../types";

const INITIAL_STATE = {
    authToken: null,
    currentUserId: null,
    loginError: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_AUTHENTICATED:
            return {
                ...state,
                authToken: action.payload.authToken,
                currentUserId: action.payload.currentUserId,
                loginError: null,
            };
        case USER_LOGGED_OUT:
            return {...state, authToken: null, currentUserId: null};
        case LOGIN_ERROR:
            return {
                loginError: action.payload,
                authToken: null,
                currentUserId: null,
            };
        case CLEAR_AUTH_ERROR: {
            return {...state, loginError: null};
        }
        default:
            return state;
    }
};
