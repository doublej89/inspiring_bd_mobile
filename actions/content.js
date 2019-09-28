import {LOAD_STORIES, REFRESH_PAGE} from "../types";
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

export const refreshPage = () => ({type: REFRESH_PAGE});
