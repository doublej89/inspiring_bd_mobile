import {LOAD_STORIES, REFRESH_PAGE, UPDATE_COMMENT_COUNT} from "../types";

const initialState = {
    stories: [],
    inspiredStoryIds: [],
    storiesPage: 1,
    hasMoreItems: false,
    refreshing: false,
    loading: true,
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
            let {stories} = state;
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
                    storiesPage: metaData.next_page,
                    hasMoreItems: true,
                    refreshing: false,
                    loading: false,
                };
            } else {
                return {
                    ...state,
                    stories: [...stories],
                    inspiredStoryIds: [...inspiredStoryIds],
                    hasMoreItems: false,
                    refreshing: false,
                    storiesPage: null,
                    loading: false,
                };
            }
        case UPDATE_COMMENT_COUNT:
            let {storyId, commentCount} = action.payload;
            let {stories} = state;
            let updatedStory = stories.find(story => story.id === storyId);
            updatedStory.comments_count = commentCount;
            return {...state, stories: [...stories]};
        case REFRESH_PAGE:
            return {
                ...state,
                storiesPage: 1,
                refreshing: true,
                stories: [],
                inspiredStoryIds: [],
                hasMoreItems: false,
                loading: false,
            };
        default:
            return state;
    }
}
