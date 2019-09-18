import React, {Component} from "react";
import {Text, View, Button} from "react-native";
import {connect} from "react-redux";
import {logout} from "../actions/auth";

class Home extends Component {
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Text>Home</Text>
                <Button title="Logout" onPress={this.props.logout} />
            </View>
        );
    }
}

export default connect(
    null,
    {logout},
)(Home);
