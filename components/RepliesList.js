import React, {Component} from "react";
import {
    View,
    FlatList,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Text,
    Alert,
} from "react-native";
import {connect} from "react-redux";
import {
    loadReplies,
    submitReply,
    updateReplyCount,
    closeRepliesList,
    updateComment,
    deleteComment,
    changeConnectionState,
} from "../actions/content";
import Comment from "./Comment";
import ModalCloseButton from "./ModalCloseButton";
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
            newReplyContent: "",
            storyId: null,
            commentId: null,
            repliesCount: 0,
            updateSelected: false,
            isMenuVisible: false,
            selectedCommentId: null,
            selectedCommentBody: "",
            selectedCommentId: null,
            selectedParentId: null,
        };
        this.replyField = React.createRef();
        this.handleCommentSubmission = this.handleCommentSubmission.bind(this);
        this.handleSubmitEditing = this.handleSubmitEditing.bind(this);
        this.replyToReply = this.replyToReply.bind(this);
        this.toggleEditMenu = this.toggleEditMenu.bind(this);
    }

    componentDidMount() {
        const {navigation, loadReplies, authToken} = this.props;
        let storyId = +JSON.stringify(navigation.getParam("storyId", "NO-ID"));
        let commentId = +JSON.stringify(
            navigation.getParam("commentId", "NO-ID"),
        );
        let repliesCount = +JSON.stringify(
            navigation.getParam("repliesCount", "0"),
        );
        this.setState({storyId, commentId, repliesCount});
        loadReplies(storyId, commentId, authToken, repliesCount);
        NetInfo.isConnected.addEventListener(
            "connectionChange",
            isConnected => {
                this.props.changeConnectionState(isConnected);
                if (!isConnected) this.props.navigation.navigate("NoNetwork");
            },
        );
    }

    componentDidUpdate(prevProps, prevState) {
        let {repliesCount, updateSelected} = this.state;
        let currCommentsLength = this.props.replies.length;
        let prevCommentsLength = prevProps.replies.length;
        if (currCommentsLength > prevCommentsLength) {
            let diff = currCommentsLength - prevCommentsLength;
            repliesCount += diff;
            this.setState({repliesCount});
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

    toggleEditMenu(
        visiblity,
        commentId = null,
        commentBody = "",
        parentId = null,
    ) {
        if (commentId === null || commentBody.length === 0) {
            this.setState({isMenuVisible: visiblity});
        } else {
            this.setState({
                isMenuVisible: visiblity,
                selectedCommentId: commentId,
                selectedCommentBody: commentBody,
                selectedParentId: parentId,
            });
        }
    }

    // componentWillUnmount() {
    //     this.props.closeRepliesList();
    // }

    handleCommentSubmission(evt) {
        const {submitReply, authToken} = this.props;
        const {newReplyContent, storyId, commentId} = this.state;

        if (evt.nativeEvent.key === "Enter") {
            this.setState({newReplyContent: ""}, () => {
                console.log("On key press: " + newReplyContent);
                submitReply(newReplyContent, storyId, commentId, authToken);
            });
        }
    }

    handleSubmitEditing(evt) {
        const {text} = evt.nativeEvent;
        const {submitReply, authToken, updateComment} = this.props;
        const {
            storyId,
            commentId,
            updateSelected,
            selectedCommentId,
            selectedParentId,
        } = this.state;
        if (!updateSelected) {
            this.setState({newReplyContent: ""}, () => {
                submitReply(text, storyId, commentId, authToken);
            });
        } else {
            this.setState(
                {
                    selectedCommentId: null,
                    selectedCommentBody: "",
                    newReplyContent: "",
                    updateSelected: false,
                    selectedParentId: null,
                    // updatedCommentBody: "",
                    // isUpdateInputVisible: false,
                },
                () => {
                    updateComment(
                        selectedCommentId,
                        storyId,
                        text,
                        authToken,
                        true,
                    );
                },
            );
        }
    }

    replyToReply(username) {
        this.setState({newReplyContent: `@${username}`}, () => {
            this.replyField.current.focus();
        });
    }

    render() {
        const {replies, currentUserId, authToken, deleteComment} = this.props;
        const {
            newReplyContent,
            selectedCommentId,
            selectedParentId,
            isMenuVisible,
            updateSelected,
            storyId,
        } = this.state;
        return (
            <View style={{flexDirection: "column", flex: 1}}>
                <View style={{flex: 0.9}}>
                    {/* <View style={{flexDirection: "row"}}>
                        <Button
                            title="Go back"
                            onPress={() => this.props.navigation.goBack()}
                        />
                        <Button
                            title="Close"
                            onPress={() => this.props.screenProps.dismiss()}
                        />
                    </View> */}
                    <FlatList
                        data={replies}
                        renderItem={({item}) => (
                            <Comment
                                // {...this._panResponder.panHandlers}
                                comment={item}
                                replyToReply={this.replyToReply}
                                toggleEditMenu={this.toggleEditMenu}
                                currentUser={
                                    item.user.id === currentUserId
                                        ? true
                                        : false
                                }
                            />
                        )}
                        keyExtractor={item => item.id.toString()}
                        extraData={this.props}
                        // {...this._panResponder.panHandlers}
                    />
                </View>
                <TextInput
                    ref={this.replyField}
                    placeholder="Write reply..."
                    onKeyPress={this.handleCommentSubmission}
                    onChangeText={value =>
                        this.setState({newReplyContent: value})
                    }
                    onSubmitEditing={this.handleSubmitEditing}
                    style={styles.textInputStyle}
                    value={newReplyContent}
                    onBlur={() => {
                        if (this.state.updateSelected) {
                            this.setState({
                                updateSelected: false,
                                newReplyContent: "",
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
                                selectedParentId: null,
                            });
                        } else {
                            this.setState(
                                {
                                    newReplyContent: this.state
                                        .selectedCommentBody,
                                },
                                () => {
                                    this.replyField.current.focus();
                                },
                            );
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
                                                    selectedParentId,
                                                );
                                                this.setState({
                                                    isMenuVisible: false,
                                                    selectedCommentId: null,
                                                    selectedParentId: null,
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
        );
    }
}

const styles = StyleSheet.create({
    textInputStyle: {
        height: 40,
        width: "90%",
        borderWidth: 1,
        borderColor: "#4CAF50",
        borderRadius: 20,
        marginTop: 12,
        flex: 0.1,
        alignSelf: "center",
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
    replies: state.commentList.replies,
});

export default connect(mapStateToProps, {
    loadReplies,
    submitReply,
    updateReplyCount,
    closeRepliesList,
    updateComment,
    deleteComment,
    changeConnectionState,
})(CommentList);
