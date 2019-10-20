/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from "react";
import {Easing, Animated} from "react-native";
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

const MainStack = createStackNavigator({
    Home: HomeScreen,
    Profile: ProfileScreen,
});

const AppStack = createStackNavigator(
    {
        Main: {screen: MainStack},
        CommentsList: {screen: CommentScreen},
    },
    {
        mode: "modal",
        headerMode: "none",
        navigationOptions: {
            gesturesEnabled: false,
        },
        transitionConfig: () => ({
            transitionSpec: {
                duration: 750,
                easing: Easing.out(Easing.poly(4)),
                timing: Animated.timing,
                useNativeDriver: true,
            },
            screenInterpolator: sceneProps => {
                const {layout, position, scene} = sceneProps;
                const thisSceneIndex = scene.index;

                const height = layout.initHeight;
                const translateY = position.interpolate({
                    inputRange: [
                        thisSceneIndex - 1,
                        thisSceneIndex,
                        thisSceneIndex + 1,
                    ],
                    outputRange: [height, 0, 0],
                });

                return {transform: [{translateY}]};
            },
        }),
    },
);

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
