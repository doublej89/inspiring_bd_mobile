import {combineReducers} from "redux";
import authReducer from "./authReducer";
import contentReducer from "./content";
import commentsReducer from "./commentsReducer";
import profileReducer from "./profileReducer";

export default combineReducers({
    auth: authReducer,
    content: contentReducer,
    commentList: commentsReducer,
    profile: profileReducer,
});
