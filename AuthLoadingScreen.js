import React from "react";
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";
import decode from "jwt-decode";
import {connect} from "react-redux";
import {USER_AUTHENTICATED} from "./types";

class AuthLoadingScreen extends React.Component {
    componentDidMount() {
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const authToken = await AsyncStorage.getItem("authToken");
        if (authToken) {
            const decoded = decode(authToken);
            this.props.dispatch({
                type: USER_AUTHENTICATED,
                payload: {
                    authToken,
                    currentUserId: decoded.user_id,
                },
            });
        }
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(authToken ? "App" : "Auth");
    };

    // Render any loading content that you like here
    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

export default connect()(AuthLoadingScreen);
