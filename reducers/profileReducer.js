import {FETCH_USER} from "../types";

const initialState = {
    user: null,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER: {
            if (action.payload) return {...state, user: action.payload};
        }
        default: {
            return state;
        }
    }
}
