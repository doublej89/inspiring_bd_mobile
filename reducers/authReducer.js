import {USER_AUTHENTICATED, USER_LOGGED_OUT} from "../types";

const INITIAL_STATE = {
    authToken: null,
    currentUserId: null,
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_AUTHENTICATED:
            return {
                ...state,
                authToken: action.payload.authToken,
                currentUserId: action.payload.currentUserId,
            };
        case USER_LOGGED_OUT:
            return {...state, authToken: null, currentUserId: null};
        default:
            return state;
    }
};
