import React, {Component} from "react";
import {View, FlatList, TextInput, Button, StyleSheet} from "react-native";
import {connect} from "react-redux";
import {
    loadRootComments,
    submitComment,
    updateCommentCount,
    closeCommentList,
} from "../actions/content";
import Comment from "./Comment";

class CommentList extends Component {
    constructor(props) {
        super(props);
        this.state = {newCommentContent: "", storyId: null, commentCount: 0};
        this.handleCommentSubmission = this.handleCommentSubmission.bind(this);
        this.handleSubmitEditing = this.handleSubmitEditing.bind(this);
    }

    componentDidMount() {
        const {
            commentsPage,
            hasMoreItems,
            navigation,
            loadRootComments,
            authToken,
        } = this.props;
        let storyId = JSON.stringify(navigation.getParam("storyId", "NO-ID"));
        let commentCount = JSON.stringify(
            navigation.getParam("commentsCount", "0"),
        );
        this.setState({storyId, commentCount});
        loadRootComments(
            storyId,
            authToken,
            commentCount,
            hasMoreItems,
            commentsPage,
        );
    }

    componentDidUpdate(prevProps) {
        let {commentCount} = this.state;
        let currCommentsLength = this.props.comments.length;
        let prevCommentsLength = prevProps.comments.length;
        if (currCommentsLength > prevCommentsLength) {
            let diff = currCommentsLength - prevCommentsLength;
            commentCount += diff;
            this.setState({commentCount});
        }
    }

    componentWillUnmount() {
        this.props.closeCommentList();
    }

    handleCommentSubmission(evt) {
        const {submitComment, authToken} = this.props;
        const {newCommentContent, storyId} = this.state;

        if (evt.nativeEvent.key === "Enter") {
            this.setState({newCommentContent: ""}, () => {
                console.log("On key press: " + newCommentContent);
                submitComment(newCommentContent, storyId, authToken);
            });
        }
    }

    handleSubmitEditing(evt) {
        const {text} = evt.nativeEvent;
        const {submitComment, authToken} = this.props;
        const {storyId} = this.state;
        this.setState({newCommentContent: ""}, () => {
            console.log("Submit editing: " + text);
            submitComment(text, storyId, authToken);
        });
    }

    render() {
        const {
            loadRootComments,
            commentsPage,
            hasMoreItems,
            comments,
            authToken,
        } = this.props;
        const {commentCount, storyId, newCommentContent} = this.state;
        return (
            <View style={{flexDirection: "column", flex: 1}}>
                <View style={{flex: 0.9}}>
                    <Button
                        title="Close"
                        onPress={() => this.props.navigation.goBack()}
                    />
                    <FlatList
                        data={comments}
                        renderItem={({item}) => (
                            <Comment
                                // {...this._panResponder.panHandlers}
                                comment={item}
                                navigation={this.props.navigation}
                            />
                        )}
                        keyExtractor={item => item.id.toString()}
                        onEndReached={() =>
                            loadRootComments(
                                storyId,
                                authToken,
                                commentCount,
                                hasMoreItems,
                                commentsPage,
                            )
                        }
                        onEndReachedThreshold={0.5}
                        initialNumToRender={10}
                        extraData={this.props}
                        // {...this._panResponder.panHandlers}
                    />
                </View>
                <TextInput
                    placeholder="Write comment..."
                    onKeyPress={this.handleCommentSubmission}
                    onChangeText={value =>
                        this.setState({newCommentContent: value})
                    }
                    onSubmitEditing={this.handleSubmitEditing}
                    style={styles.textInputStyle}
                    value={newCommentContent}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textInputStyle: {
        textAlign: "center",
        height: 40,
        width: "90%",
        borderWidth: 1,
        borderColor: "#4CAF50",
        borderRadius: 7,
        marginTop: 12,
        flex: 0.1,
    },
});

const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    comments: state.commentList.comments,
    commentsPage: state.commentList.commentsPage,
    hasMoreItems: state.commentList.hasMoreItems,
});

export default connect(
    mapStateToProps,
    {loadRootComments, submitComment, updateCommentCount, closeCommentList},
)(CommentList);
