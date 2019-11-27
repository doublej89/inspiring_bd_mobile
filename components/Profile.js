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
    unseeUserProfile,
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
        this.currentUserCanFollow = this.currentUserCanFollow.bind(this);
        this.currentUserCanUnfollow = this.currentUserCanUnfollow.bind(this);
        this.loadUser = this.loadUser.bind(this);
    }

    componentDidMount() {
        this.props.navigation.addListener("didFocus", this.loadUser);
        this.props.navigation.addListener(
            "didBlur",
            this.props.unseeUserProfile,
        );
    }

    // componentDidUpdate(prevProps) {
    //     const {fetchUser, authToken, currentUserId, userId} = this.props;
    //     console.log("Profile uppdating with: " + userId + ", " + currentUserId);
    //     if (userId && prevProps.userId !== userId) {
    //         console.log("fetching updated user");
    //         fetchUser(userId, authToken, currentUserId);
    //     } else if (prevProps.userId && !userId) {
    //         fetchUser(currentUserId, authToken);
    //     }
    // }

    loadUser() {
        const {fetchUser, authToken, currentUserId, userId} = this.props;
        // let userId = +JSON.stringify(navigation.getParam("userId", "NO-ID"));
        if (userId) {
            fetchUser(userId, authToken, currentUserId);
        } else {
            fetchUser(currentUserId, authToken);
        }
    }

    // componentWillUnmount() {
    //     console.log("Profile closing !");
    //     this.props.unseeUserProfile();
    // }

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
            this.props.userId !== null &&
            this.props.currentUserId !== this.props.userId
        );
    }

    currentUserCanUnfollow() {
        return (
            this.props.currentUserFollowing &&
            this.props.userId !== null &&
            this.props.currentUserId !== this.props.userId
        );
    }

    render() {
        const {user, currentUserId, follow, userId, authToken} = this.props;
        console.log(user);
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
                        {userId === null || userId === currentUserId ? (
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
                            justifyContent: "flex-end",
                        }}>
                        <Text style={{fontSize: 26}}>{user.name}</Text>
                        {/* <Text style={{fontSize: 20, color: "#848cf6"}}>
                            @{user.handle}
                        </Text> */}
                        {this.currentUserCanFollow() && (
                            <Button
                                title="Connect"
                                onPress={() =>
                                    follow(userId, currentUserId, authToken)
                                }
                            />
                        )}
                        {this.currentUserCanUnfollow() && (
                            <Button
                                title="DisConnect"
                                onPress={() =>
                                    unfollow(userId, currentUserId, authToken)
                                }
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
                        {userId === null || userId === currentUserId ? (
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
        height: 400,
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
    userId: state.profile.userId,
});

export default connect(mapStateToProps, {
    fetchUser,
    uploadProfilePhoto,
    follow,
    unfollow,
    unseeUserProfile,
})(Profile);
