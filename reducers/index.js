import {combineReducers} from "redux";
import authReducer from "./authReducer";
import contentReducer from "./content";
import commentsReducer from "./commentsReducer";

export default combineReducers({
    auth: authReducer,
    content: contentReducer,
    commentList: commentsReducer,
});
