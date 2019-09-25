import {combineReducers} from "redux";
import authReducer from "./authReducer";
import contentReducer from "./content";

export default combineReducers({
    auth: authReducer,
    content: contentReducer,
});
