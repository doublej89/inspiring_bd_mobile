import {
    LOAD_STORIES,
    REFRESH_PAGE,
    UPDATE_COMMENT_COUNT,
    INSPIRE_STORY,
    UPLOAD_PROGRESS,
    SUBMIT_STORY,
} from "../types";

const initialState = {
    stories: [],
    inspiredStoryIds: [],
    storiesPage: 1,
    hasMoreItems: false,
    refreshing: false,
    loading: true,
    uploadProgress: 0,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LOAD_STORIES: {
            let data = action.payload;
            let metaData = data.meta;
            let {stories, inspiredStoryIds} = state;

            if (metaData && metaData.inspired_story_ids) {
                inspiredStoryIds.push(...metaData.inspired_story_ids);
            }
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
        }
        case SUBMIT_STORY: {
            const {stories} = state;
            return {...state, stories: [action.payload, ...stories]};
        }
        case UPLOAD_PROGRESS: {
            return {...state, uploadProgress: action.payload};
        }
        case UPDATE_COMMENT_COUNT: {
            let storyId = action.payload;
            let {stories} = state;
            const updatedStories = stories.map(story => {
                if (story.id === storyId) {
                    return {...story, comments_count: story.comments_count + 1};
                }
                return story;
            });
            return {...state, stories: updatedStories};
        }
        case INSPIRE_STORY: {
            const {deleted, storyId} = action.payload;
            const {stories} = state;
            const updatedStories = stories.map(story => {
                if (story.id === storyId) {
                    return {
                        ...story,
                        inspirations_count: !deleted
                            ? story.inspirations_count + 1
                            : story.inspirations_count - 1,
                        current_user_inspired: !deleted ? true : false,
                    };
                }
                return story;
            });
            return {...state, stories: updatedStories};
        }
        case REFRESH_PAGE: {
            return {
                ...state,
                storiesPage: 1,
                refreshing: true,
                stories: [],
                inspiredStoryIds: [],
                hasMoreItems: false,
                loading: false,
            };
        }
        default: {
            return state;
        }
    }
}
