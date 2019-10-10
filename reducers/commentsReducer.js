import {LOAD_COMMENTS, SUBMIT_COMMENT, SET_COMMENT_COUNT} from "../types";

const initialState = {
    comments: [],
    page: 1,
    newCommentContent: "",
    hasMoreItems: true,
    commentCount: 0,
};

export default function commentsReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_COMMENTS:
            let data = action.payload;
            let {comments} = state;
            if (data.comments.length > 0) {
                data.comments.map(comment => {
                    if (!comments.some(e => e.id === comment.id)) {
                        comments.unshift(comment);
                    }
                });
            }
            if (data.meta.next_page) {
                return {
                    ...state,
                    comments: comments,
                    page: data.meta.next_page,
                };
            }
            return {
                ...state,
                comments: comments,
                page: null,
                hasMoreItems: false,
            };
        case SUBMIT_COMMENT:
            let {comment, commentCount} = action.payload;
            if (comment) {
                const {comments} = state;
                comments.unshift(comment);
                commentCount += 1;
                return {...state, comments: comments, commentCount};
            }
        case SET_COMMENT_COUNT:
            return {...state, commentCount: action.payload};
    }
}
