import React, {Component} from "react";
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Image,
    Button,
} from "react-native";
import {fetchUser, uploadProfilePhoto} from "../actions/content";
import {connect} from "react-redux";
import ImagePicker from "react-native-image-picker";

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            userId: null,
            currentUserId: null,
            avatarPhotoSource: null,
            coverPhotoSource: null,
        };
        this.handleChooseAvatarPhoto = this.handleChooseAvatarPhoto.bind(this);
        this.handleChooseCoverPhoto = this.handleChooseCoverPhoto.bind(this);
    }

    componentDidMount() {
        const {navigation, fetchUser, authToken, currentUserId} = this.props;
        let userId = +JSON.stringify(navigation.getParam("userId", "NO-ID"));
        if (userId) {
            this.setState({userId: userId, currentUserId: currentUserId}, () =>
                fetchUser(userId, authToken),
            );
        } else {
            this.setState(
                {userId: currentUserId, currentUserId: currentUserId},
                () => fetchUser(currentUserId, authToken),
            );
        }
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
                let file = {
                    name: response.fileName,
                    type: response.type,
                    uri:
                        Platform.OS === "android"
                            ? response.uri
                            : response.uri.replace("file://", ""),
                };
                uploadProfilePhoto(currentUserId, authToken, null, file);
            }
        });
    }

    handleChooseAvatarPhoto() {
        const {authToken, currentUserId} = this.props;
        const options = {
            title: "Upload avatar",
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
                let file = {
                    name: response.fileName,
                    type: response.type,
                    uri:
                        Platform.OS === "android"
                            ? response.uri
                            : response.uri.replace("file://", ""),
                };
                uploadProfilePhoto(currentUserId, authToken, file);
            }
        });
    }

    render() {
        const {userId, currentUserId} = this.state;
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
                            }}>
                            <Image style={{width: "100%", height: "100%"}} />
                            {userId === currentUserId && (
                                <Button
                                    onPress={this.handleChooseAvatarPhoto}
                                    style={{height: 60}}
                                />
                            )}
                        </View>
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

export default connect(mapStateToProps, {fetchUser, uploadProfilePhoto})(
    Profile,
);
