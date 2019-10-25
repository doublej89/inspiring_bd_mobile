import React, {Component} from "react";
import {View, FlatList, TextInput, Button, StyleSheet} from "react-native";
import {connect} from "react-redux";
import {
    loadReplies,
    submitReply,
    updateReplyCount,
    closeRepliesList,
} from "../actions/content";
import Comment from "./Comment";
import ModalCloseButton from "./ModalCloseButton";

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
        };
        this.handleCommentSubmission = this.handleCommentSubmission.bind(this);
        this.handleSubmitEditing = this.handleSubmitEditing.bind(this);
    }

    componentDidMount() {
        const {navigation, loadReplies, authToken} = this.props;
        let storyId = JSON.stringify(navigation.getParam("storyId", "NO-ID"));
        let commentId = +JSON.stringify(
            navigation.getParam("commentId", "NO-ID"),
        );
        let repliesCount = +JSON.stringify(
            navigation.getParam("repliesCount", "0"),
        );
        this.setState({storyId, commentId, repliesCount});
        loadReplies(storyId, commentId, authToken, repliesCount);
    }

    componentDidUpdate(prevProps) {
        let {repliesCount} = this.state;
        let currCommentsLength = this.props.replies.length;
        let prevCommentsLength = prevProps.replies.length;
        if (currCommentsLength > prevCommentsLength) {
            let diff = currCommentsLength - prevCommentsLength;
            repliesCount += diff;
            this.setState({repliesCount});
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
        const {submitReply, authToken} = this.props;
        const {storyId, commentId} = this.state;
        this.setState({newReplyContent: ""}, () => {
            console.log("Submit reply: " + text);
            submitReply(text, storyId, commentId, authToken);
        });
    }

    render() {
        const {replies} = this.props;
        const {newReplyContent} = this.state;
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
                            />
                        )}
                        keyExtractor={item => item.id.toString()}
                        extraData={this.props}
                        // {...this._panResponder.panHandlers}
                    />
                </View>
                <TextInput
                    placeholder="Write reply..."
                    onKeyPress={this.handleCommentSubmission}
                    onChangeText={value =>
                        this.setState({newReplyContent: value})
                    }
                    onSubmitEditing={this.handleSubmitEditing}
                    style={styles.textInputStyle}
                    value={newReplyContent}
                />
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
});

const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    replies: state.commentList.replies,
});

export default connect(
    mapStateToProps,
    {loadReplies, submitReply, updateReplyCount, closeRepliesList},
)(CommentList);
