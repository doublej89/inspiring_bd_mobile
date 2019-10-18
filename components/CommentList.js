import React, {Component} from "react";
import {View, FlatList, TextInput, Button} from "react-native";
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
        } = this.props;
        let storyId = JSON.stringify(navigation.getParam("storyId", "NO-ID"));
        let commentCount = JSON.stringify(
            navigation.getParam("commentsCount", "0"),
        );
        this.setState({storyId, commentCount});
        loadRootComments(storyId, commentCount, hasMoreItems, commentsPage);
    }

    componentDidUpdate(prevProps) {
        let {storyId, commentCount} = this.state;
        let currCommentsLength = this.props.comments.length;
        let prevCommentsLength = prevProps.comments.length;
        if (currCommentsLength > prevCommentsLength) {
            let diff = currCommentsLength - prevCommentsLength;
            commentCount += diff;
            this.setState({commentCount});
            updateCommentCount(storyId, commentCount);
        }
    }

    componentWillUnmount() {
        this.props.closeCommentList();
    }

    handleCommentSubmission(evt) {
        const {submitComment, authToken} = this.props;
        const {newCommentContent, storyId, commentCount} = this.state;

        if (evt.nativeEvent.key === "Enter") {
            this.setState({newCommentContent: ""}, () => {
                submitComment(
                    newCommentContent,
                    storyId,
                    commentCount,
                    authToken,
                );
            });
        }
    }

    handleSubmitEditing(evt) {
        const {text} = evt.nativeEvent;
        const {submitComment, authToken} = this.props;
        const {storyId, commentCount} = this.state;
        this.setState({newCommentContent: ""}, () => {
            submitComment(text, storyId, commentCount, authToken);
        });
    }

    render() {
        const {loadRootComments, commentsPage, hasMoreItems} = this.props;
        return (
            <View style={{flexDirection: "column"}}>
                <Button onPress={() => this.props.navigation.goBack()} />
                <FlatList
                    data={comments}
                    renderItem={({item}) => (
                        <Comment
                            // {...this._panResponder.panHandlers}
                            comment={item}
                        />
                    )}
                    keyExtractor={item => item.id.toString()}
                    onEndReached={() =>
                        loadRootComments(story.id, hasMoreItems, commentsPage)
                    }
                    onEndReachedThreshold={0.5}
                    initialNumToRender={10}
                    // {...this._panResponder.panHandlers}
                />
                <TextInput
                    onKeyPress={this.handleCommentSubmission}
                    onChangeText={value =>
                        this.setState({newCommentContent: value})
                    }
                    onSubmitEditing={this.handleSubmitEditing}
                />
            </View>
        );
    }
}

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
