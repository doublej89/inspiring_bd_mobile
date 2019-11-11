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
    UPDATE_COMMENT,
    DELETE_COMMENT,
    UPDATE_STORY,
    DELETE_STORY,
    UPDATE_REPLY,
    DELETE_REPLY,
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

export const submitStory = (
    description,
    file,
    authToken,
    storyId = null,
) => dispatch => {
    const storyContent = strim(description);
    let formData = new FormData();
    formData.append("story[description]", storyContent);
    if (file !== null) {
        formData.append("story[photos][]", file, file.name);
    }
    const config = {
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
    };
    if (storyContent.length > 0) {
        let request;
        if (storyId === null) {
            request = axios.post(
                "https://dev.inspiringbangladesh.com/api/v1/stories",
                formData,
                config,
            );
        } else {
            console.log(formData);
            request = axios.patch(
                `https://dev.inspiringbangladesh.com/api/v1/stories/${storyId}`,
                formData,
                config,
            );
        }
        request.then(response => {
            if (response.data.story) {
                console.log(response.data.story);
                dispatch({
                    type: storyId === null ? SUBMIT_STORY : UPDATE_STORY,
                    payload: response.data.story,
                });
            }
        });
    }
};

export const deleteStory = (storyId, authToken) => dispatch => {
    axios
        .delete(
            `https://dev.inspiringbangladesh.com/api/v1/stories/${storyId}`,
            {
                headers: {
                    Authorization: authToken,
                },
            },
        )
        .then(() => dispatch({type: DELETE_STORY, payload: storyId}));
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
    if (commentsCount > 0) {
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
                    console.log(response.data.comments);
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

export const updateComment = (
    commentId,
    storyId,
    newCommentBody,
    authToken,
    reply = false,
) => dispatch => {
    let commentContent = strim(newCommentBody);
    console.log(commentContent);
    if (commentContent.length > 0) {
        axios
            .put(
                `https://dev.inspiringbangladesh.com/api/v1/stories/${storyId}/comments/${commentId}`,
                {comment: {body: commentContent}},
                {
                    headers: {
                        Authorization: authToken,
                    },
                },
            )
            .then(response => {
                if (response.data.comment) {
                    console.log(response.data.comment);
                    dispatch({
                        type: reply ? UPDATE_REPLY : UPDATE_COMMENT,
                        payload: response.data,
                    });
                }
            })
            .catch(err => {
                console.log("Comment update error");
                console.log(err);
            });
    }
};

export const deleteComment = (
    commentId,
    storyId,
    authToken,
    parentId = null,
) => dispatch => {
    axios
        .delete(
            `https://dev.inspiringbangladesh.com/api/v1/stories/${storyId}/comments/${commentId}`,
            {
                headers: {
                    Authorization: authToken,
                },
            },
        )
        .then(() => {
            dispatch({
                type: parentId === null ? DELETE_COMMENT : DELETE_REPLY,
                payload: commentId,
            });
            if (parentId !== null) {
                dispatch(updateReplyCount(parentId, "down"));
            }
            dispatch(updateCommentCount(storyId, "down"));
        });
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
                    dispatch(updateReplyCount(commentId, "up"));
                    dispatch(
                        updateCommentCount(
                            response.data.comment.story_id,
                            "up",
                        ),
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

export const updateCommentCount = (storyId, updateType) => ({
    type: UPDATE_COMMENT_COUNT,
    payload: {storyId, updateType},
});

export const updateReplyCount = (commentId, updateType) => ({
    type: UPDATE_REPLY_COUNT,
    payload: {commentId, updateType},
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
