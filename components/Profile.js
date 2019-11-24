import React, {Component} from "react";
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Image,
    Button,
    TouchableOpacity,
} from "react-native";
import {
    fetchUser,
    uploadProfilePhoto,
    follow,
    unfollow,
} from "../actions/content";
import {connect} from "react-redux";
import ImagePicker from "react-native-image-picker";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
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
            this.setState({userId: userId}, () =>
                fetchUser(userId, authToken, currentUserId),
            );
        } else {
            this.setState({userId: currentUserId}, () =>
                fetchUser(currentUserId, authToken),
            );
        }
    }

    handleChooseCoverPhoto() {
        const {authToken, currentUserId, uploadProfilePhoto} = this.props;
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
        const {authToken, currentUserId, uploadProfilePhoto} = this.props;
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

    currentUserCanFollow() {
        return (
            !this.props.currentUserFollowing &&
            this.props.currentUserId !== this.state.userId
        );
    }

    render() {
        const {userId} = this.state;
        const {user, currentUserId, follow} = this.props;
        return user ? (
            <ScrollView
                style={{padding: 20, flex: 1, backgroundColor: "#F8F9FF"}}>
                <View style={styles.profileHeader}>
                    <View
                        style={{
                            flex: 0.5,
                            backgroundColor: "pink",
                            borderTopStartRadius: 10,
                            borderTopEndRadius: 10,
                        }}>
                        {userId === currentUserId ? (
                            <TouchableOpacity
                                onPress={this.handleChooseCoverPhoto}>
                                <Image
                                    source={{uri: user.cover_photo_url}}
                                    style={{width: "100%", height: "100%"}}
                                />
                            </TouchableOpacity>
                        ) : (
                            <Image
                                source={{uri: user.cover_photo_url}}
                                style={{width: "100%", height: "100%"}}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            flex: 0.5,
                            backgroundColor: "white",
                            borderBottomStartRadius: 10,
                            borderBottomEndRadius: 10,
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <Text style={{fontSize: 20}}>{user.name}</Text>
                        <Text style={{fontSize: 16, color: "#848cf6"}}>
                            @{user.handle}
                        </Text>
                        {this.currentUserCanFollow() && (
                            <Button
                                title="Connect"
                                onPress={() => follow(userId, authToken)}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            height: 200,
                            width: 200,
                            backgroundColor: "gray",
                            position: "absolute",
                            alignSelf: "center",
                            borderRadius: 100,
                            zIndex: 5,
                        }}>
                        {userId === currentUserId ? (
                            <TouchableOpacity
                                onPress={this.handleChooseAvatarPhoto}>
                                <Image
                                    source={{uri: user.avatar_url}}
                                    style={{width: "100%", height: "100%"}}
                                />
                                {/* <View
                                style={{
                                    height: 40,
                                    backgroundColor: "red",
                                    borderRadius: 20,
                                }}></View> */}
                            </TouchableOpacity>
                        ) : (
                            // <Button
                            //     onPress={this.handleChooseAvatarPhoto}
                            //     style={{height: 60}}
                            //     title="change"
                            // />
                            <Image
                                source={{uri: user.avatar_url}}
                                style={{width: "100%", height: "100%"}}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.stat}>
                    <View>
                        <Text>{user.stories_count}</Text>
                        <Text>Stories</Text>
                    </View>
                    <View style={styles.bar}></View>
                    <View>
                        <Text>{user.followers_count}</Text>
                        <Text>Connections</Text>
                    </View>
                    <View style={styles.bar}></View>
                    <View>
                        <Text>{user.net_inspiration_point}</Text>
                        <Text>Points</Text>
                    </View>
                </View>
            </ScrollView>
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
        justifyContent: "center",
    },
    stat: {
        backgroundColor: "white",
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    number: {
        fontSize: 16,
    },
    bar: {
        height: 40,
        width: 1,
        backgroundColor: "#A4A4A4",
    },
});

const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    currentUserId: state.auth.currentUserId,
    user: state.profile.user,
    currentUserFollowing: state.profile.currentUserFollowing,
});

export default connect(mapStateToProps, {
    fetchUser,
    uploadProfilePhoto,
    follow,
    unfollow,
})(Profile);
