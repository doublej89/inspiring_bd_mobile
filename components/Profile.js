import React, {Component} from "react";
import {Text, View, StyleSheet, SafeAreaView, ScrollView} from "react-native";
import {connect} from "react-redux";

class Profile extends Component {
    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#F8F9FF"}}>
                <ScrollView style={{padding: 20}}>
                    <View style={styles.profileHeader}>
                        <View
                            style={{
                                flex: 0.7,
                                backgroundColor: "pink",
                                borderTopStartRadius: 10,
                                borderTopEndRadius: 10,
                            }}></View>
                        <View
                            style={{
                                flex: 0.3,
                                backgroundColor: "white",
                                borderBottomStartRadius: 10,
                                borderBottomEndRadius: 10,
                            }}></View>
                        <View
                            style={{
                                height: 120,
                                width: 120,
                                backgroundColor: "gray",
                                position: "absolute",
                                left: 0,
                                top: 0,
                            }}></View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    profileHeader: {
        height: 500,
        alignItems: "stretch",
        borderRadius: 10,
    },
});

export default Profile;
