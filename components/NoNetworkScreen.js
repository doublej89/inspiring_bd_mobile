import React, {Component} from "react";
import {Text, View} from "react-native";
import {connect} from "react-redux";

class NoNetworkScreen extends Component {
    componentDidMount() {
        if (this.props.isConnected) this._bootstrapAsync();
    }

    componentDidUpdate() {
        if (this.props.isConnected) this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const authToken = await AsyncStorage.getItem("authToken");
        let isExpired = false;
        if (authToken) {
            const decoded = decode(authToken);
            let expTime = +decoded.exp;
            let currTime = new Date().getTime();
            if (currTime > expTime * 1000) isExpired = true;
            else {
                this.props.dispatch({
                    type: USER_AUTHENTICATED,
                    payload: {
                        authToken,
                        currentUserId: decoded.user_id,
                    },
                });
            }
        }
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(!isExpired ? "App" : "Auth");
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Text style={{fontSize: 18}}>No network connection!</Text>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    isConnected: state.global.isConnected,
});

export default connect(mapStateToProps)(NoNetworkScreen);
