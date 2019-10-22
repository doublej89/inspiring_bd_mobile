import {
    LOAD_COMMENTS,
    SUBMIT_COMMENT,
    CLOSE_COMMENTS_LIST,
    LOAD_COMMENT_REPLIES,
    UPDATE_REPLY_COUNT,
    SUBMIT_REPLY,
    CLOSE_REPLIES_LIST,
} from "../types";

const initialState = {
    comments: [],
    commentsPage: 1,
    hasMoreItems: true,
    replies: [],
};

export default function commentsReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_COMMENTS: {
            let data = action.payload;
            let {comments} = state;
            if (data.comments.length > 0) {
                data.comments.forEach(comment => {
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
        }
        case SUBMIT_COMMENT: {
            let {comment} = action.payload;
            if (comment) {
                const {comments} = state;
                comments.unshift(comment);
                return {...state, comments: [...comments]};
            }
            break;
        }
        case CLOSE_COMMENTS_LIST: {
            return {
                ...state,
                comments: [],
                commentsPage: 1,
                hasMoreItems: true,
            };
        }
        case LOAD_COMMENT_REPLIES: {
            let data = action.payload;
            let {replies} = state;
            if (data.comments.length > 0) {
                data.comments.forEach(comment => {
                    if (!replies.some(e => e.id === comment.id)) {
                        replies.push(comment);
                    }
                });
            }
            return {...state, replies: [...replies]};
        }
        case SUBMIT_REPLY: {
            const reply = action.payload.comment;
            const {replies} = state;
            replies.push(reply);
            return {...state, replies: [...replies]};
        }
        case UPDATE_REPLY_COUNT: {
            const {commentId} = action.payload;
            const {comments} = state;
            const commentToUpdate = comments.find(e => e.id === commentId);
            commentToUpdate.replies_count += 1;
            return {...state, comments: [...comments]};
        }
        case CLOSE_REPLIES_LIST: {
            return {...state, replies: []};
        }
        default: {
            return state;
        }
    }
}
