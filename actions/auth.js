import { AsyncStorage } from "react-native";
import { USER_AUTHENTICATED, USER_LOGGED_OUT } from "../types";

export const login = credentials => dispatch => {
    fetch("http://192.168.0.104:5000/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
        })
    }).then(response => {
        console.log("backend response:")
        console.log(response);
        AsyncStorage.setItem("authToken", response.auth_token);
        dispatch({
            type: USER_AUTHENTICATED,
            payload: response.auth_token
        })
    }).catch(err => {
        console.log("Something went wrong! ");
        console.log(err);
    })
}

export const signup  = credentials => dispatch => {
    fetch("http://localhost:5000/api/v1/signup", {
        method: "POST",
        body: JSON.stringify({
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
            password_confirmation: credentials.password_confirmation
        })
    }).then(response => {
        AsyncStorage.setItem("authToken", response.auth_token);
        dispatch({
            type: USER_AUTHENTICATED,
            payload: response.auth_token
        })
    })
}

export const logout = () => dispatch => {
    fetch("http://localhost:5000/users/sign_out", {
        method: "DELETE"
    }).then(response => {
        AsyncStorage.removeItem("authToken");
        dispatch({type: USER_LOGGED_OUT})
    })
}