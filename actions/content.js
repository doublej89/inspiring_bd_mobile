import {LOAD_STORIES, REFRESH_PAGE, LOAD_COMMENTS} from "../types";
import axios from "axios";

export const loadItems = page => dispatch => {
    if (page === null) return;
    axios
        .get("https://dev.inspiringbangladesh.com/api/v1/stories", {
            params: {
                per_page: 10,
                current_user_meta: true,
                page: page,
            },
        })
        .then(respJson => {
            if (respJson.data.stories) {
                console.log(respJson.data);
                dispatch({type: LOAD_STORIES, payload: respJson.data});
            }
        })
        .catch(err => console.log(err));
};

export const loadRootComments = (
    storyId,
    commentsCount,
    hasMoreItems,
    page,
) => dispatch => {
    if (page === null) return;
    if (commentsCount > 0 && hasMoreItems) {
        axios
            .get(
                `https://dev.inspiringbangladesh.com/api/v1/stories/${storyId}/comments`,
                {
                    params: {
                        root_comments: true,
                        per_page: 10,
                        current_user_meta: true,
                        page: page,
                    },
                },
            )
            .then(response => {
                if (response.data.comments) {
                    dispatch({type: LOAD_COMMENTS, payload: response.data});
                }
            });
    }
};

export const refreshPage = () => ({type: REFRESH_PAGE});
