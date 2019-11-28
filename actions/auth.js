import {AsyncStorage} from "react-native";
import {
    USER_AUTHENTICATED,
    USER_LOGGED_OUT,
    LOGIN_ERROR,
    CLEAR_AUTH_ERROR,
} from "../types";
import decode from "jwt-decode";
import axios from "axios";

export const login = (credentials, navigation) => dispatch => {
    axios
        .post(
            "https://dev.inspiringbangladesh.com/api/v1/auth/login",
            credentials,
        )
        .then(response => {
            if (response.data.error_message) {
                dispatch({
                    type: LOGIN_ERROR,
                    payload: response.data.error_message,
                });
                return;
            }
            let decoded;
            if (response.data.auth_token) {
                decoded = decode(response.data.auth_token);
            }
            AsyncStorage.setItem("authToken", response.data.auth_token);
            dispatch({
                type: USER_AUTHENTICATED,
                payload: {
                    authToken: response.data.auth_token,
                    currentUserId: +decoded.user_id,
                },
            });
            if (response.data.auth_token) navigation.navigate("App");
        })
        .catch(err => {
            console.log("Something went wrong! ");
            console.log(err);
        });
};

export const signup = (credentials, navigation, showMessage) => dispatch => {
    axios
        .post("https://dev.inspiringbangladesh.com/api/v1/signup", credentials)
        .then(response => {
            let decoded;
            if (response.data.auth_token) {
                decoded = decode(response.data.auth_token);
            }
            AsyncStorage.setItem("authToken", response.data.auth_token);
            dispatch({
                type: USER_AUTHENTICATED,
                payload: {
                    authToken: response.data.auth_token,
                    currentUserId: +decoded.user_id,
                },
            });
            if (response.data.auth_token) {
                navigation.navigate("App");
                showMessage({
                    title: response.data.message,
                    type: "success",
                });
            }
        });
};

export const logout = navigation => dispatch => {
    AsyncStorage.removeItem("authToken").then(() => {
        dispatch({type: USER_LOGGED_OUT});
        navigation.navigate("Auth");
    });
    // fetch("https://dev.inspiringbangladesh.com/users/sign_out", {
    //     method: "DELETE",
    // }).then(response => {

    // });
};

export const clearAuthError = () => ({type: CLEAR_AUTH_ERROR});
