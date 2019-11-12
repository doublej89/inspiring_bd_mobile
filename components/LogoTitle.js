import React from "react";
import {Image} from "react-native";
import LogoIcon from "../assets/icons/logo_inspbd-01.svg";

function LogoTitle() {
    return (
        // <Image
        //     source={require("../assets/images/logo.png")}
        //     style={{width: 30, height: 30}}
        // />
        <LogoIcon style={{width: 30, height: 30}} />
    );
}

export default LogoTitle;
