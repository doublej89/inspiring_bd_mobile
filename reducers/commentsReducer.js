import {LOAD_COMMENTS} from "../types";

const initialState = {
    comments: [],
    page: 1,
    newCommentContent: "",
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
                    page: data.meta.next_page,
                };
            }
            return {
                ...state,
                comments: comments,
                page: null,
                hasMoreItems: false,
            };
    }
}
