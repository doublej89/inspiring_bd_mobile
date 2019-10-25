import React from "react";
import {Button} from "react-native";
import {connect} from "react-redux";
import {closeCommentsModal} from "../actions/content";

function ModalCloseButton(props) {
    const {closeCommentsModal, dismiss} = props;
    return (
        <Button
            onPress={() => {
                closeCommentsModal();
                dismiss();
            }}
            title="Close"
            color="#4287f5"
        />
    );
}

export default connect(
    null,
    {closeCommentsModal},
)(ModalCloseButton);
