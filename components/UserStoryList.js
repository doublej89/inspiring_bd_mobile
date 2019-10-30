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
        };

        this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
        this.handleStorySubmit = this.handleStorySubmit.bind(this);
        this.onModalToggle = this.onModalToggle.bind(this);
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
                });
            }
        });
    }

    handleStorySubmit() {
        const {photoSource, description} = this.state;
        const {submitStory, authToken} = this.props;
        if (photoSource !== null) {
            let file = {
                name: photoSource.fileName,
                type: photoSource.type,
                uri:
                    Platform.OS === "android"
                        ? photoSource.uri
                        : photoSource.uri.replace("file://", ""),
            };
            let storyDescription = description;
            this.setState({description: ""}, () =>
                submitStory(storyDescription, file, authToken),
            );
        }
    }

    onModalToggle() {
        this.setState({isModalVisible: !this.state.isModalVisible});
    }

    componentDidMount() {
        this.props.navigation.setParams({logout: this.props.logout});
        const {storiesPage} = this.props;
        this.props.loadItems(storiesPage);
    }

    // componentDidUpdate(prevProps) {
    //     const {
    //         stories,
    //         comments,
    //         selectedStoryId,
    //         loadRootComments,
    //         hasMoreItems,
    //         commentsPage,
    //     } = this.props;

    //     if (selectedStoryId !== null) {
    //         let selectedStory;
    //         if (this.state.selectedStory) {
    //             selectedStory = this.state.selectedStory;
    //             if (comments.length - prevProps.comments.length === 1) {
    //                 selectedStory.comments_count += 1;
    //                 this.setState({selectedStory: selectedStory});
    //             }
    //         } else {
    //             selectedStory = stories.find(
    //                 story => story.id === selectedStoryId,
    //             );
    //             this.setState({selectedStory: selectedStory});
    //         }
    //         if (comments === null) {
    //             loadRootComments(
    //                 selectedStoryId,
    //                 selectedStory.comments_count,
    //                 hasMoreItems,
    //                 commentsPage,
    //             );
    //         }
    //         this._panel.show();
    //     } else {
    //         if (this.state.selectedStory !== null) {
    //             this.setState({selectedStory: null});
    //         }
    //     }
    // }

    _handleRefresh = () => {
        this.props.refreshPage();
        this.props.loadItems(1);
    };

    // _onGrant() {
    //     this.setState({dragPanel: false});
    //     return true;
    // }

    // _onRelease() {
    //     this.setState({dragPanel: true});
    // }

    // handleCommentSubmission(evt) {
    //     const {submitComment, authToken} = this.props;
    //     const {newCommentContent, selectedStory} = this.state;
    //     if (evt.nativeEvent.key === "Enter") {
    //         this.setState({newCommentContent: ""}, () => {
    //             submitComment(
    //                 newCommentContent,
    //                 selectedStory.id,
    //                 selectedStory.comments_count,
    //                 authToken,
    //             );
    //         });
    //     }
    // }

    // handleSubmitEditing(evt) {
    //     const {text} = evt.nativeEvent;
    //     const {submitComment, authToken} = this.props;
    //     const {selectedStory} = this.state;
    //     this.setState({newCommentContent: ""}, () => {
    //         submitComment(
    //             text,
    //             selectedStory.id,
    //             selectedStory.comments_count,
    //             authToken,
    //         );
    //     });
    // }

    render() {
        const {
            stories,
            storiesPage,
            loadItems,
            refreshing,
            loading,
            navigation,
        } = this.props;
        const {photoSource, description} = this.state;

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
                            <Story story={item} navigation={navigation} />
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
                {/* </View> */}
                <Modal
                    isVisible={this.state.isModalVisible}
                    onBackdropPress={this.onModalToggle}
                    hideModalContentWhileAnimating={true}>
                    <View style={{flex: 1, backgroundColor: "#fff"}}>
                        <TextInput
                            placeholder="Create a story..."
                            onChangeText={value =>
                                this.setState({description: value})
                            }
                            value={description}
                        />
                        {photoSource && (
                            <Image
                                style={{width: 200, height: 200}}
                                source={{uri: this.state.photoSource.uri}}
                            />
                        )}
                        <TouchableOpacity onPress={this.handleChoosePhoto}>
                            <PickerIcon style={{width: 50, height: 50}} />
                        </TouchableOpacity>
                        <Button
                            title="Submit"
                            onPress={this.handleStorySubmit}
                        />
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
    stories: state.content.stories,
    storiesPage: state.content.storiesPage,
    refreshing: state.content.refreshing,
});

export default connect(
    mapStateToProps,
    {loadItems, refreshPage, logout, submitStory},
)(UserStoryList);
