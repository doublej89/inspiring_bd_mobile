import React, {Component} from "react";
import {View, StyleSheet, Text, TouchableOpacity} from "react-native";
import PickerIcon from "../assets/icons/Ellipse_11_2.svg";

function StoryForm(props) {
    const {activateModal} = props;
    return (
        <TouchableOpacity onPress={() => activateModal(true)}>
            <View style={styles.container}>
                <Text style={{fontSize: 20, color: "#4e4b4b"}}>
                    Create a story
                </Text>
                <View style={styles.circleShapeView}>
                    <Text style={{fontSize: 24, color: "white"}}>+</Text>
                </View>
                {/* <PickerIcon style={{height: 50, width: 50}} /> */}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 18,
    },
    circleShapeView: {
        width: 52,
        height: 52,
        borderRadius: 52 / 2,
        backgroundColor: "#00BCD4",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default StoryForm;
