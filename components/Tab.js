import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faHome, faUserCog} from "@fortawesome/free-solid-svg-icons";
import {TouchableOpacity} from "react-native";
import Animated from "react-native-reanimated";

function Tab({focusAnim, title, onPress}) {
    if (title === "Home") {
        return (
            <TouchableOpacity onPress={onPress}>
                <FontAwesomeIcon
                    icon={faHome}
                    size={25}
                    style={{
                        color: "gray",
                    }}
                />
            </TouchableOpacity>
        );
    }
    if (title === "Profile") {
        return (
            <TouchableOpacity onPress={onPress}>
                <FontAwesomeIcon
                    icon={faUserCog}
                    size={25}
                    style={{
                        color: "gray",
                    }}
                />
            </TouchableOpacity>
        );
    }
}

export default Tab;
