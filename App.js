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
import {
    createBottomTabNavigator,
    createMaterialTopTabNavigator,
} from "react-navigation-tabs";
import {createDismissableStackNavigator} from "./createDismissableStackNavigator";
import HomeScreen from "./components/UserStoryList";
import RegisterScreen from "./components/Register";
import LoginScreen from "./components/Login";
import ProfileScreen from "./components/Profile";
import CommentScreen from "./components/CommentList";
import RepliesScreen from "./components/RepliesList";
import NoNetworkScreen from "./components/NoNetworkScreen";
import TabBar from "./components/TabBar";
import AuthLoadingScreen from "./AuthLoadingScreen";
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faHome, faUserCog} from "@fortawesome/free-solid-svg-icons";
import FlashMessage from "react-native-flash-message";

const store = createStore(reducers, applyMiddleware(thunk));

const getTabBarIcon = (navigation, focused, tintColor) => {
    const {routeName} = navigation.state;
    let iconName;
    if (routeName === "Home") {
        iconName = faHome;
    } else if (routeName === "Profile") {
        iconName = faUserCog;
    }
    // You can return any component that you like here!
    return <FontAwesomeIcon icon={iconName} size={25} color={tintColor} />;
};

const MainStack = createMaterialTopTabNavigator(
    {
        Home: HomeScreen,
        Profile: ProfileScreen,
    },
    {
        // defaultNavigationOptions: {
        //     headerTintColor: "#61A2FF",
        //     headerStyle: {
        //         backgroundColor: "#fff",
        //         color: "#61A2FF",
        //     },
        //     headerTitleStyle: {
        //         fontWeight: "bold",
        //     },
        // },
        // defaultNavigationOptions: ({navigation}) => ({
        //     tabBarIcon: ({focused, tintColor}) =>
        //         getTabBarIcon(navigation, focused, tintColor),
        // }),
        // tabBarOptions: {
        //     activeTintColor: "blue",
        //     inactiveTintColor: "gray",
        // },
        tabBarComponent: TabBar,
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

const AuthStack = createStackNavigator(
    {
        Login: LoginScreen,
        Register: RegisterScreen,
    },
    {
        headerMode: "none",
        navigationOptions: {
            headerVisible: false,
        },
    },
);

const AppContainer = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: AuthLoadingScreen,
            App: AppStack,
            Auth: AuthStack,
            NoNetwork: NoNetworkScreen,
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
                <FlashMessage position="top" />
            </Provider>
        );
    }
}
