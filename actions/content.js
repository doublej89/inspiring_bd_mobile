import {
    LOAD_STORIES,
    REFRESH_PAGE,
    LOAD_COMMENTS,
    SUBMIT_COMMENT,
    OPEN_COMMENTS_LIST,
    CLOSE_COMMENTS_LIST,
    UPDATE_COMMENT_COUNT,
    LOAD_COMMENT_REPLIES,
    UPDATE_REPLY_COUNT,
    SUBMIT_REPLY,
    CLOSE_REPLIES_LIST,
} from "../types";
import axios from "axios";
import {strim} from "../utils";

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
    authToken,
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
                    headers: {
                        Authorization: authToken,
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

export const submitComment = (
    newCommentContent,
    storyId,
    authToken,
) => dispatch => {
    let commentContent = strim(newCommentContent);
    if (commentContent.length > 0) {
        console.log("Sending comment: " + commentContent);
        axios
            .post(
                `https://dev.inspiringbangladesh.com/api/v1/stories/${storyId}/comments`,
                {comment: {body: commentContent}},
                {
                    headers: {
                        Authorization: authToken,
                    },
                },
            )
            .then(response => {
                if (response.data.comment) {
                    dispatch({
                        type: SUBMIT_COMMENT,
                        payload: response.data,
                    });
                    dispatch(
                        updateCommentCount(response.data.comment.story_id),
                    );
                }
            })
            .catch(err => {
                console.log("Comment submission error");
                console.log(err);
            });
    }
};

export const submitReply = (
    newReplyContent,
    storyId,
    commentId,
    authToken,
) => dispatch => {
    let replyContent = strim(newReplyContent);
    if (replyContent.length > 0) {
        console.log("Sending replyt: " + replyContent);
        axios
            .post(
                `https://dev.inspiringbangladesh.com/api/v1/stories/${storyId}/comments`,
                {comment: {body: replyContent, parent_id: commentId}},
                {
                    headers: {
                        Authorization: authToken,
                    },
                },
            )
            .then(response => {
                if (response.data.comment) {
                    dispatch({
                        type: SUBMIT_REPLY,
                        payload: response.data,
                    });
                    dispatch(updateReplyCount(commentId));
                }
            })
            .catch(err => {
                console.log("Comment reply submission error");
                console.log(err);
            });
    }
};

export const openCommentsList = storyId => ({
    type: OPEN_COMMENTS_LIST,
    payload: storyId,
});

export const closeCommentList = () => ({
    type: CLOSE_COMMENTS_LIST,
});

export const updateCommentCount = storyId => ({
    type: UPDATE_COMMENT_COUNT,
    payload: storyId,
});

export const updateReplyCount = commentId => ({
    type: UPDATE_REPLY_COUNT,
    payload: commentId,
});

export const loadReplies = (
    storyId,
    commentId,
    authToken,
    repliesCount,
) => dispatch => {
    if (repliesCount > 0) {
        axios
            .get(
                `https://dev.inspiringbangladesh.com/api/v1/stories/${storyId}/comments`,
                {
                    params: {
                        parent_id: commentId,
                        skip_paginate: true,
                    },
                    headers: {
                        Authorization: authToken,
                    },
                },
            )
            .then(response => {
                if (response.data.comments) {
                    dispatch({
                        type: LOAD_COMMENT_REPLIES,
                        payload: response.data,
                    });
                }
            });
    }
};

export const closeRepliesList = () => ({
    type: CLOSE_REPLIES_LIST,
});

export const refreshPage = () => ({type: REFRESH_PAGE});
