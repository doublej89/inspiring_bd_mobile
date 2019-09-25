import {LOAD_STORIES, REFRESH_PAGE} from "../types";

const initialState = {
    stories: [],
    inspiredStoryIds: [],
    page: 1,
    hasMoreItems: false,
    refreshing: false,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LOAD_STORIES:
            let data = action.payload;
            let metaData = data.meta;
            let inspiredStoryIds = state.inspiredStoryIds;

            if (metaData && metaData.inspired_story_ids) {
                inspiredStoryIds.push(...metaData.inspired_story_ids);
            }
            let stories = state.stories;
            data.stories.map(story => {
                if (
                    inspiredStoryIds &&
                    inspiredStoryIds.indexOf(story.id) >= 0
                ) {
                    story.current_user_inspired = true;
                }
                stories.push(story);
            });

            if (metaData.next_page) {
                return {
                    ...state,
                    stories: [...stories],
                    inspiredStoryIds: [...inspiredStoryIds],
                    page: metaData.next_page,
                    hasMoreItems: true,
                    refreshing: false,
                };
            } else {
                return {
                    ...state,
                    stories: [...stories],
                    inspiredStoryIds: [...inspiredStoryIds],
                    hasMoreItems: false,
                    refreshing: false,
                };
            }
        case REFRESH_PAGE:
            return {...state, page: 1, refreshing: true};
        default:
            return state;
    }
}
