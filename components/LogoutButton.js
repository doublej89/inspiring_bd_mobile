import React from "react";
import {Button} from "react-native";
import {connect} from "react-redux";
import {logout} from "../actions/auth";

function LogoutButton(props) {
    const {navigation, logout} = props;
    return (
        <Button
            onPress={() => logout(navigation)}
            title="Logout"
            color="#4287f5"
        />
    );
}

export default connect(
    null,
    {logout},
)(LogoutButton);
