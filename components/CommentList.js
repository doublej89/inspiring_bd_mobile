import React, {Component} from "react";
import {
    View,
    FlatList,
    TextInput,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
} from "react-native";
import {connect} from "react-redux";
import {
    loadRootComments,
    submitComment,
    updateCommentCount,
    closeCommentList,
} from "../actions/content";
import Comment from "./Comment";
import ModalCloseButton from "./ModalCloseButton";
import {
    updateComment,
    deleteComment,
    changeConnectionState,
} from "../actions/content";
import Modal from "react-native-modal";
import NetInfo from "@react-native-community/netinfo";

class CommentList extends Component {
    static navigationOptions = props => {
        return {
            headerRight: (
                <ModalCloseButton dismiss={props.screenProps.dismiss} />
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            newCommentContent: "",
            storyId: null,
            commentCount: 0,
            isMenuVisible: false,
            selectedCommentId: null,
            // updatedCommentBody: "",
            selectedCommentBody: "",
            updateSelected: false,
            // isUpdateInputVisible: false,
        };
        this.commentField = React.createRef();
        this.handleCommentSubmission = this.handleCommentSubmission.bind(this);
        this.handleSubmitEditing = this.handleSubmitEditing.bind(this);
        // this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
        this.toggleEditMenu = this.toggleEditMenu.bind(this);
    }

    componentDidMount() {
        const {
            commentsPage,
            hasMoreItems,
            navigation,
            loadRootComments,
            authToken,
        } = this.props;
        let storyId = +JSON.stringify(navigation.getParam("storyId", "NO-ID"));
        let commentCount = +JSON.stringify(
            navigation.getParam("commentsCount", "0"),
        );
        let writeComment = JSON.stringify(
            navigation.getParam("writeComment", "NO"),
        );
        console.log("Comment count comment " + storyId + ": " + commentCount);
        this.setState({storyId, commentCount});
        loadRootComments(
            storyId,
            authToken,
            commentCount,
            hasMoreItems,
            commentsPage,
        );
        if (writeComment === "yes") {
            this._textInput.focus();
        }
        NetInfo.isConnected.addEventListener(
            "connectionChange",
            isConnected => {
                this.props.changeConnectionState(isConnected);
                if (!isConnected) this.props.navigation.navigate("NoNetwork");
            },
        );
    }

    componentDidUpdate(prevProps, prevState) {
        let {updateSelected} = this.state;
        // let currCommentsLength = this.props.comments.length;
        // let prevCommentsLength = prevProps.comments.length;
        // if (currCommentsLength > prevCommentsLength) {
        //     let diff = currCommentsLength - prevCommentsLength;
        //     commentCount += diff;
        //     this.setState({commentCount});
        // }
        if (updateSelected !== prevState.updateSelected && updateSelected) {
            this.setState(
                {newCommentContent: this.state.selectedCommentBody},
                () => {
                    this._textInput.focus();
                },
            );
        }
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            "connectionChange",
            isConnected => {
                this.props.changeConnectionState(isConnected);
            },
        );
    }

    handleCommentSubmission(evt) {
        const {submitComment, updateComment, authToken} = this.props;
        const {
            newCommentContent,
            storyId,
            updateSelected,
            selectedCommentId,
        } = this.state;

        if (evt.nativeEvent.key === "Enter") {
            if (!updateSelected) {
                this.setState({newCommentContent: ""}, () => {
                    console.log("On key press: " + newCommentContent);
                    submitComment(newCommentContent, storyId, authToken);
                });
            } else {
                this.setState(
                    {
                        selectedCommentId: null,
                        selectedCommentBody: "",
                        newCommentContent: "",
                        updateSelected: false,
                        // updatedCommentBody: "",
                        // isUpdateInputVisible: false,
                    },
                    () => {
                        updateComment(
                            selectedCommentId,
                            storyId,
                            newCommentContent,
                            authToken,
                        );
                    },
                );
            }
        }
    }

    handleSubmitEditing(evt) {
        const {text} = evt.nativeEvent;
        const {submitComment, updateComment, authToken} = this.props;
        const {storyId, updateSelected, selectedCommentId} = this.state;
        if (!updateSelected) {
            this.setState({newCommentContent: ""}, () => {
                submitComment(text, storyId, authToken);
            });
        } else {
            this.setState(
                {
                    selectedCommentId: null,
                    selectedCommentBody: "",
                    newCommentContent: "",
                    updateSelected: false,
                    // updatedCommentBody: "",
                    // isUpdateInputVisible: false,
                },
                () => {
                    updateComment(selectedCommentId, storyId, text, authToken);
                },
            );
        }
    }

    toggleEditMenu(visiblity, commentId = null, commentBody = "") {
        if (commentId === null || commentBody.length === 0) {
            this.setState({isMenuVisible: visiblity});
        } else {
            this.setState({
                isMenuVisible: visiblity,
                selectedCommentId: commentId,
                selectedCommentBody: commentBody,
            });
        }
    }

    // handleUpdateSubmit(evt) {
    //     const {text} = evt.nativeEvent;
    //     const {storyId, selectedCommentId} = this.state;
    //     const {updateComment, authToken} = this.props;
    //     this.setState(
    //         {
    //             selectedCommentId: null,
    //             selectedCommentBody: "",
    //             updatedCommentBody: "",
    //             // isUpdateInputVisible: false,
    //         },
    //         () => {
    //             updateComment(selectedCommentId, storyId, text, authToken);
    //         },
    //     );
    // }

    render() {
        const {
            loadRootComments,
            commentsPage,
            hasMoreItems,
            comments,
            authToken,
            deleteComment,
            currentUserId,
        } = this.props;
        const {
            commentCount,
            storyId,
            newCommentContent,
            isMenuVisible,
            selectedCommentId,
            updateSelected,
        } = this.state;
        console.log(comments);
        return (
            <View style={{flexDirection: "column", flex: 1, padding: 20}}>
                <View style={{flex: 0.9}}>
                    {/* <Button
                        title="Close"
                        onPress={() => this.props.screenProps.dismiss()}
                    /> */}
                    <FlatList
                        data={comments}
                        renderItem={({item}) => (
                            <Comment
                                // {...this._panResponder.panHandlers}
                                comment={item}
                                navigation={this.props.navigation}
                                toggleEditMenu={this.toggleEditMenu}
                                currentUser={
                                    item.user.id === currentUserId
                                        ? true
                                        : false
                                }
                            />
                        )}
                        keyExtractor={item => item.id.toString()}
                        // onEndReached={() =>
                        //     loadRootComments(
                        //         storyId,
                        //         authToken,
                        //         commentCount,
                        //         hasMoreItems,
                        //         commentsPage,
                        //     )
                        // }
                        onEndReachedThreshold={0.5}
                        initialNumToRender={10}
                        extraData={this.props}
                        // {...this._panResponder.panHandlers}
                    />
                </View>
                <TextInput
                    ref={component => (this._textInput = component)}
                    placeholder="Write comment..."
                    onKeyPress={this.handleCommentSubmission}
                    onChangeText={value =>
                        this.setState({newCommentContent: value})
                    }
                    onSubmitEditing={this.handleSubmitEditing}
                    style={styles.textInputStyle}
                    value={newCommentContent}
                    onBlur={() => {
                        if (this.state.updateSelected) {
                            this.setState({
                                updateSelected: false,
                                newCommentContent: "",
                                selectedCommentId: null,
                                selectedCommentBody: "",
                            });
                        }
                    }}
                />
                <Modal
                    isVisible={isMenuVisible}
                    onSwipeComplete={() => this.toggleEditMenu(false)}
                    swipeDirection={["down"]}
                    onModalHide={() => {
                        if (!updateSelected) {
                            this.setState({
                                selectedCommentId: null,
                                selectedCommentBody: "",
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
                {/* <Modal
                    isVisible={isUpdateInputVisible}
                    onSwipeComplete={() =>
                        this.setState({isUpdateInputVisible: false})
                    }
                    swipeDirection={["down"]}
                    onModalShow={() =>
                        this.setState({
                            updateSelected: false,
                            updatedCommentBody: selectedCommentBody,
                        })
                    }
                    style={styles.bottomModal}>
                    <View style={{backgroundColor: "white", height: 80}}>
                        <TextInput
                            onChangeText={value =>
                                this.setState({updatedCommentBody: value})
                            }
                            onSubmitEditing={this.handleUpdateSubmit}
                            value={updatedCommentBody}
                            style={styles.textInputStyle}
                        />
                    </View>
                </Modal> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textInputStyle: {
        alignSelf: "center",
        height: 60,
        width: "90%",
        borderWidth: 1,
        borderColor: "#4CAF50",
        borderRadius: 20,
        marginTop: 12,
        flex: 0.1,
    },
    container: {
        justifyContent: "flex-end",
        alignItems: "stretch",
        backgroundColor: "white",
        borderRadius: 4,
    },
    bottomModal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    option: {
        padding: 20,
        height: 50,
        borderBottomColor: "rgba(0, 0, 0, 0.4)",
    },
});

const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    currentUserId: state.auth.currentUserId,
    comments: state.commentList.comments,
    commentsPage: state.commentList.commentsPage,
    hasMoreItems: state.commentList.hasMoreItems,
});

export default connect(mapStateToProps, {
    loadRootComments,
    submitComment,
    updateCommentCount,
    closeCommentList,
    updateComment,
    deleteComment,
    changeConnectionState,
})(CommentList);
