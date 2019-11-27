import {
    FETCH_USER,
    FOLLOW,
    SEE_USER_PROFILE,
    UNSEE_USER_PROFILE,
} from "../types";

const initialState = {
    userId: null,
    user: null,
    currentUserFollowing: false,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER: {
            if (action.payload) {
                return {
                    ...state,
                    user: action.payload.user,
                    currentUserFollowing: action.payload.following,
                };
            }
        }
        case FOLLOW: {
            return {...state, currentUserFollowing: action.payload};
        }
        case SEE_USER_PROFILE: {
            return {...state, userId: action.payload};
        }
        case UNSEE_USER_PROFILE: {
            return {userId: null, user: null, currentUserFollowing: false};
        }
        default: {
            return state;
        }
    }
}
