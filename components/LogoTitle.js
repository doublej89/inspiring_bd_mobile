import React from "react";
import {Image} from "react-native";

function LogoTitle() {
    return (
        <Image
            source={require("../assets/images/logo.png")}
            style={{width: 30, height: 30}}
        />
    );
}

export default LogoTitle;
