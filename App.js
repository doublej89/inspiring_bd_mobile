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
import {createDismissableStackNavigator} from "./createDismissableStackNavigator";
import HomeScreen from "./components/UserStoryList";
import RegisterScreen from "./components/Register";
import LoginScreen from "./components/Login";
import ProfileScreen from "./components/Profile";
import CommentScreen from "./components/CommentList";
import RepliesScreen from "./components/RepliesList";
import AuthLoadingScreen from "./AuthLoadingScreen";
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import reducers from "./reducers";

const store = createStore(reducers, applyMiddleware(thunk));

const MainStack = createStackNavigator(
    {
        Home: HomeScreen,
        Profile: ProfileScreen,
    },
    {
        defaultNavigationOptions: {
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#f4511e",
                color: "#fff",
            },
            headerTitleStyle: {
                fontWeight: "bold",
            },
        },
    },
);

const CommentsStack = createDismissableStackNavigator(
    {
        CommentsList: {screen: CommentScreen},
        RepliesList: {screen: RepliesScreen},
    },
    {initialRouteName: "CommentsList"},
);

const AppStack = createStackNavigator(
    {
        Main: {screen: MainStack},
        Comments: {screen: CommentsStack},
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
