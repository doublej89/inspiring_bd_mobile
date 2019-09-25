import {LOAD_STORIES, REFRESH_PAGE} from "../types";

export const loadItems = page => dispatch => {
    fetch("https://dev.inspiringbangladesh.com/api/v1/stories", {
        method: "GET",
        body: JSON.stringify({
            per_page: 10,
            current_user_meta: true,
            page: page,
        }),
    })
        .then(response => response.json())
        .then(respJson => {
            if (respJson.stories)
                dispatch({type: LOAD_STORIES, payload: respJson});
        })
        .catch(err => console.log(err));
};

export const refreshPage = () => ({type: REFRESH_PAGE});
