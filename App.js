/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from "react";
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
} from "react-native";

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from "react-native/Libraries/NewAppScreen";
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import HomeScreen from "./components/UserStoryList";
import RegisterScreen from "./components/Register";
import LoginScreen from "./components/Login";
import ProfileScreen from "./components/Profile";
import CommentScreen from "./components/CommentList";
import AuthLoadingScreen from "./AuthLoadingScreen";
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import reducers from "./reducers";

const store = createStore(reducers, applyMiddleware(thunk));

const AppStack = createStackNavigator({
    Home: HomeScreen,
    Comments: CommentScreen,
    Profile: ProfileScreen,
});

const AuthStack = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen,
});

const AppContainer = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: AuthLoadingScreen,
            App: AppStack,
            Auth: AuthStack,
        },
        {
            initialRouteName: "AuthLoading",
        },
    ),
);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: "absolute",
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "600",
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: "400",
        color: Colors.dark,
    },
    highlight: {
        fontWeight: "700",
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: "600",
        padding: 4,
        paddingRight: 12,
        textAlign: "right",
    },
});
