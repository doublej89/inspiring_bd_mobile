import {FETCH_USER, FOLLOW} from "../types";

const initialState = {
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
        default: {
            return state;
        }
    }
}
