import {AsyncStorage} from "react-native";
import {USER_AUTHENTICATED, USER_LOGGED_OUT} from "../types";
import decode from "jwt-decode";

export const login = credentials => dispatch => {
    fetch("https://dev.inspiringbangladesh.com/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
        }),
    })
        .then(response => {
            console.log("backend response:");
            console.log(response);
            let decoded;
            if (response.auth_token) {
                decoded = decode(response.auth_token);
            }
            AsyncStorage.setItem("authToken", response.auth_token);
            dispatch({
                type: USER_AUTHENTICATED,
                payload: {
                    authToken: response.auth_token,
                    currentUserId: decoded.user_id,
                },
            });
            return response.auth_token;
        })
        .catch(err => {
            console.log("Something went wrong! ");
            console.log(err);
        });
};

export const signup = credentials => dispatch => {
    fetch("https://dev.inspiringbangladesh.com/api/v1/signup", {
        method: "POST",
        body: JSON.stringify({
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
            password_confirmation: credentials.password_confirmation,
        }),
    }).then(response => {
        let decoded;
        if (response.auth_token) {
            decoded = decode(response.auth_token);
        }
        AsyncStorage.setItem("authToken", response.auth_token);
        dispatch({
            type: USER_AUTHENTICATED,
            payload: {
                authToken: response.auth_token,
                currentUserId: decoded.user_id,
            },
        });
        return response.auth_token;
    });
};

export const logout = () => dispatch => {
    fetch("https://dev.inspiringbangladesh.com/users/sign_out", {
        method: "DELETE",
    }).then(response => {
        AsyncStorage.removeItem("authToken");
        dispatch({type: USER_LOGGED_OUT});
    });
};
