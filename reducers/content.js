import {LOAD_STORIES} from "../types";

const initialState = {
    stories: [],
    inspiredStoryIds: [],
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LOAD_STORIES:
            return {...state, stories: [...state.stories, ...action.payload]};
        default:
            return state;
    }
}
