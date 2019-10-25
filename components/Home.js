import React, {Component} from "react";
import {Text, View, Button} from "react-native";
import {connect} from "react-redux";
import {logout} from "../actions/auth";
import UserStoryList from "./UserStoryList";
import LogoTitle from "./LogoTitle";

class Home extends Component {
    componentDidMount() {
        this.props.navigation.setParams({logout: this.props.logout});
    }

    render() {
        return (
            <View
            // style={{
            //     flex: 1,
            //     justifyContent: "center",
            //     alignItems: "center",
            // }}
            >
                {/* <Button
                    title="Logout"
                    onPress={() => this.props.logout(this.props.navigation)}
                /> */}
                <UserStoryList />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps,
    {logout},
)(Home);
