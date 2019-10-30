import React, {Component} from "react";
import {View, Button} from "react-native";

function StoryForm(props) {
    const {activateModal} = props;
    return (
        <Button
            title="Create a story..."
            color="#4287f5"
            onPress={activateModal}
            style={{width: "100%"}}
        />
    );
}

export default StoryForm;
