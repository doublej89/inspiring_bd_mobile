import {CONNECTION_CHANGED, PROFILE_PIC_CHANGED} from "../types";

const initialState = {
    isConnected: true,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case CONNECTION_CHANGED: {
            return {...state, isConnected: action.payload};
        }
        default: {
            return state;
        }
    }
}
