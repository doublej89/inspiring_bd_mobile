import { USER_AUTHENTICATED, USER_LOGGED_OUT } from "../types";
import decode from 'jwt-decode';

const INITIAL_STATE = {
    authToken: null,
    userId: null
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_AUTHENTICATED:
            const decoded = decode(action.payload);
            return { ...state, authToken: action.payload, userId: decoded.user_id };
        case USER_LOGGED_OUT:
            return { ...state, authToken: null, userId: null };
        default:
            return state;
    }
}