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
    CLOSE_COMMENTS_MODAL,
    INSPIRE_STORY,
    UPLOAD_PROGRESS,
    SUBMIT_STORY,
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
                dispatch({type: LOAD_STORIES, payload: respJson.data});
            }
        })
        .catch(err => console.log(err));
};

export const submitStory = (description, file, authToken) => dispatch => {
    const storyContent = strim(description);
    let formData = new FormData();
    formData.append("story[description]", storyContent);
    formData.append("story[photos][]", file, file.name);
    if (storyContent.length > 0) {
        axios
            .post(
                "https://dev.inspiringbangladesh.com/api/v1/stories",
                formData,
                {
                    headers: {
                        Authorization: authToken,
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: function(progressEvent) {
                        let percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total,
                        );
                        dispatch({
                            type: UPLOAD_PROGRESS,
                            payload: percentCompleted,
                        });
                    },
                },
            )
            .then(response => {
                if (response.data.story) {
                    dispatch({
                        type: SUBMIT_STORY,
                        payload: response.data.story,
                    });
                }
            });
    }
};

export const handleInspired = (
    storyId,
    currentUserId,
    authToken,
) => dispatch => {
    axios
        .post(
            `https://dev.inspiringbangladesh.com/api/v1/stories/${storyId}/inspired`,
            {
                user_id: currentUserId,
            },
            {
                headers: {
                    Authorization: authToken,
                },
            },
        )
        .then(response => {
            dispatch({
                type: INSPIRE_STORY,
                payload: {deleted: response.data.deleted, storyId},
            });
        })
        .catch(err => {
            console.log("Story liking error");
            console.log(err);
        });
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
            })
            .catch(err => {
                console.log("Comments loading error");
                console.log(err);
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
                    dispatch(
                        updateCommentCount(response.data.comment.story_id),
                    );
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

export const closeCommentsModal = () => ({
    type: CLOSE_COMMENTS_MODAL,
});

export const refreshPage = () => ({type: REFRESH_PAGE});
