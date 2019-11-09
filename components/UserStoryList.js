import React, {Component} from "react";
import {connect} from "react-redux";
import {
    View,
    FlatList,
    ActivityIndicator,
    Button,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
} from "react-native";
import Story from "./Story";
import StoryForm from "./StoryForm";
import LogoutButton from "./LogoutButton";
import {loadItems, refreshPage, submitStory} from "../actions/content";
import {logout} from "../actions/auth";
import LogoTitle from "./LogoTitle";
import Modal from "react-native-modal";
import PickerIcon from "../assets/icons/Ellipse_11_2.svg";
import ImagePicker from "react-native-image-picker";

class UserStoryList extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: () => <LogoTitle />,
            headerRight: <LogoutButton navigation={navigation} />,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            description: "",
            isModalVisible: false,
            photoSource: null,
            updateSelected: false,
            isMenuVisible: false,
            selectedStoryId: null,
            selectedStoryBody: "",
            selectedStoryImageUri: null,
        };

        this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
        this.handleStorySubmit = this.handleStorySubmit.bind(this);
        this.onModalToggle = this.onModalToggle.bind(this);
        this.toggleEditMenu = this.toggleEditMenu.bind(this);
    }

    handleChoosePhoto() {
        const options = {
            title: "Inspiring Bangladesh",
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
                    photoSource: response,
                    selectedStoryImageUri: null,
                });
            }
        });
    }

    handleStorySubmit() {
        const {
            photoSource,
            description,
            selectedStoryId,
            updateSelected,
        } = this.state;
        const {submitStory, authToken} = this.props;
        let file = null;

        if (photoSource !== null) {
            file = {
                name: photoSource.fileName,
                type: photoSource.type,
                uri:
                    Platform.OS === "android"
                        ? photoSource.uri
                        : photoSource.uri.replace("file://", ""),
            };
        }
        let storyDescription = description;

        this.setState({description: "", isModalVisible: false}, () => {
            if (!updateSelected) {
                submitStory(storyDescription, file, authToken);
            } else {
                submitStory(storyDescription, file, authToken, selectedStoryId);
            }
        });
    }

    onModalToggle() {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    toggleEditMenu(
        visiblity,
        storyId = null,
        storyBody = "",
        storyImageUri = null,
    ) {
        if (storyId === null || storyBody.length === 0) {
            this.setState({isMenuVisible: visiblity});
        } else {
            this.setState({
                isMenuVisible: visiblity,
                selectedStoryId: storyId,
                selectedStoryBody: storyBody,
                selectedStoryImageUri: storyImageUri,
            });
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({logout: this.props.logout});
        const {storiesPage} = this.props;
        this.props.loadItems(storiesPage);
    }

    _handleRefresh = () => {
        this.props.refreshPage();
        this.props.loadItems(1);
    };

    render() {
        const {
            stories,
            storiesPage,
            loadItems,
            refreshing,
            loading,
            navigation,
        } = this.props;
        const {
            photoSource,
            description,
            selectedStoryImageUri,
            updateSelected,
            isMenuVisible,
        } = this.state;

        return !loading ? (
            <View style={{flex: 1, padding: 15}}>
                {/* <View style={{flex: 1}}> */}
                <View style={{flex: 0.1, marginBottom: 10}}>
                    <StoryForm activateModal={this.onModalToggle} />
                </View>
                <View style={{flex: 0.9}}>
                    <FlatList
                        data={stories}
                        renderItem={({item}) => (
                            <Story
                                story={item}
                                navigation={navigation}
                                toggleEditMenu={this.toggleEditMenu}
                            />
                        )}
                        keyExtractor={item => item.id.toString()}
                        onEndReached={() => loadItems(storiesPage)}
                        onEndReachedThreshold={0.5}
                        initialNumToRender={10}
                        onRefresh={this._handleRefresh}
                        refreshing={refreshing}
                        extraData={this.props}
                    />
                </View>

                <Modal
                    isVisible={this.state.isModalVisible}
                    onBackdropPress={this.onModalToggle}
                    hideModalContentWhileAnimating={true}
                    onModalHide={() => {
                        if (this.state.updateSelected) {
                            this.setState({
                                updateSelected: false,
                                selectedStoryId: null,
                                selectedStoryBody: "",
                                selectedStoryImageUri: null,
                            });
                        }
                    }}>
                    <View
                        style={{
                            backgroundColor: "#fff",
                            padding: 22,
                            borderRadius: 5,
                            justifyContent: "space-between",
                        }}>
                        <View style={{alignItems: "stretch"}}>
                            <TextInput
                                placeholder="Create a story..."
                                onChangeText={value =>
                                    this.setState({description: value})
                                }
                                value={description}
                                style={{
                                    height: 50,
                                    padding: 10,
                                    borderRadius: 5,
                                    fontSize: 16,
                                }}
                            />
                            {photoSource && (
                                <Image
                                    style={{width: 300, height: 300}}
                                    source={{uri: photoSource.uri}}
                                />
                            )}
                            {selectedStoryImageUri && (
                                <Image
                                    style={{width: 300, height: 300}}
                                    source={{uri: selectedStoryImageUri}}
                                />
                            )}
                            <TouchableOpacity onPress={this.handleChoosePhoto}>
                                <View style={{alignSelf: "flex-end"}}>
                                    <PickerIcon
                                        style={{width: 50, height: 50}}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <Button
                            title="Submit"
                            onPress={this.handleStorySubmit}
                        />
                    </View>
                </Modal>
                <Modal
                    isVisible={isMenuVisible}
                    onSwipeComplete={() => this.toggleEditMenu(false)}
                    swipeDirection={["down"]}
                    onModalHide={() => {
                        if (!updateSelected) {
                            this.setState({
                                selectedStoryId: null,
                                selectedStoryBody: "",
                                selectedStoryImageUri: null,
                            });
                        } else {
                            this.setState({
                                isModalVisible: true,
                                description: selectedStoryBody,
                            });
                        }
                    }}
                    style={styles.bottomModal}>
                    <View style={styles.container}>
                        <TouchableOpacity
                            onPress={() =>
                                this.setState({
                                    updateSelected: true,
                                    isMenuVisible: false,
                                })
                            }>
                            <View style={styles.option}>
                                <Text style={{fontSize: 20}}>Update</Text>
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
                                            onPress: () => {
                                                deleteComment(
                                                    selectedCommentId,
                                                    storyId,
                                                    authToken,
                                                );
                                                this.setState({
                                                    isMenuVisible: false,
                                                    selectedCommentId: null,
                                                });
                                            },
                                        },
                                    ],
                                );
                            }}>
                            <View style={styles.option}>
                                <Text style={{fontSize: 20}}>Delete</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        ) : (
            <View>
                <Text style={{alignSelf: "center"}}>Loading stories</Text>
                <ActivityIndicator />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    currentUserId: state.auth.currentUserId,
    stories: state.content.stories,
    storiesPage: state.content.storiesPage,
    refreshing: state.content.refreshing,
});

export default connect(
    mapStateToProps,
    {loadItems, refreshPage, logout, submitStory},
)(UserStoryList);
