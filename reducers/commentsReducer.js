import {LOAD_COMMENTS, SUBMIT_COMMENT, CLOSE_COMMENTS_LIST} from "../types";

const initialState = {
    comments: [],
    commentsPage: 1,
    hasMoreItems: true,
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
                    commentsPage: data.meta.next_page,
                };
            }
            return {
                ...state,
                comments: comments,
                commentsPage: null,
                hasMoreItems: false,
            };
        case SUBMIT_COMMENT:
            let {comment} = action.payload;
            if (comment) {
                const {comments} = state;
                comments.unshift(comment);
                return {...state, comments: comments};
            }
            break;
        case CLOSE_COMMENTS_LIST:
            return {
                ...state,
                comments: [],
                commentsPage: 1,
                hasMoreItems: true,
            };
        default:
            return state;
    }
}
