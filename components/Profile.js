import React, {Component} from "react";
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import {fetchUser} from "../actions/content";
import {connect} from "react-redux";
import ImagePicker from "react-native-image-picker";

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            avatarPhotoSource: null,
            coverPhotoSource: null,
        };
    }
    componentDidMount() {
        const {navigation, fetchUser, authToken, currentUserId} = this.props;
        let userId = +JSON.stringify(navigation.getParam("userId", "NO-ID"));
        if (userId) fetchUser(userId, authToken);
        else fetchUser(currentUserId, authToken);
    }

    handleChooseCoverPhoto() {
        const options = {
            title: "Upload cover photo",
            noData: true,
            takePhotoButtonTitle: "Take photo with your camera",
            chooseFromLibraryButtonTitle: "Choose photo from library",
        };
        ImagePicker.showImagePicker(options, response => {
            console.log("Response = ", response);

            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
            } else if (response.customButton) {
                console.log(
                    "User tapped custom button: ",
                    response.customButton,
                );
            } else if (response.uri) {
                this.setState({
                    coverPhotoSource: response,
                });
            }
        });
    }

    handleChooseAvatarPhoto() {
        const options = {
            title: "Upload cover photo",
            noData: true,
            takePhotoButtonTitle: "Take photo with your camera",
            chooseFromLibraryButtonTitle: "Choose photo from library",
        };
        ImagePicker.showImagePicker(options, response => {
            console.log("Response = ", response);

            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
            } else if (response.customButton) {
                console.log(
                    "User tapped custom button: ",
                    response.customButton,
                );
            } else if (response.uri) {
                this.setState({
                    avatarPhotoSource: response,
                });
            }
        });
    }

    render() {
        const {user} = this.props;
        return user ? (
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
                                left: 12,
                                bottom: 100,
                            }}></View>
                    </View>
                </ScrollView>
            </View>
        ) : (
            <View>
                <Text style={{alignSelf: "center"}}>
                    User profile loading...
                </Text>
                <ActivityIndicator />
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

const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    currentUserId: state.auth.currentUserId,
    user: state.profile.user,
});

export default connect(mapStateToProps, {fetchUser})(Profile);
