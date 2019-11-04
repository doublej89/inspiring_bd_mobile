import React from "react";
import Modal from "react-native-modal";
import {View, TouchableOpacity, Text, Alert, StyleSheet} from "react-native";

function UpdateDeleteModal(props) {
    const {
        passedDeleteAction,
        passedUpdateAction,
        itemIdentifier,
        toggleEditMenu,
        isMenuVisible,
    } = props;
    return (
        <Modal
            isVisible={this.state.visibleModal === "bottom"}
            onSwipeComplete={() => this.setState({visibleModal: null})}
            swipeDirection={["down"]}
            style={styles.bottomModal}>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => passedUpdateAction(itemIdentifier)}>
                    <View style={styles.option}>
                        <Text>Update</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            "Are you sure you wish to delete this item?",
                            null,
                            [
                                {
                                    text: "Cancel",
                                    onPress: () =>
                                        console.log("Cancel Pressed"),
                                },
                                {
                                    text: "OK",
                                    onPress: () =>
                                        passedDeleteAction(itemIdentifier),
                                },
                            ],
                        );
                    }}>
                    <View style={styles.option}>
                        <Text>Delete</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "stretch",
        backgroundColor: "white",
        borderRadius: 4,
        padding: 20,
        height: 400,
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    option: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.4)",
    },
});

export default UpdateDeleteModal;
