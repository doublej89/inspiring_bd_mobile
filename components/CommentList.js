import React, {Component} from "react";
import {View, FlatList} from "react-native";
import {connect} from "react-redux";
import {loadRootComments} from "../actions/content";

class CommentList extends Component {
    constructor(props) {
        super(props);
        this.state = {newCommentContent: ""};
    }

    componentDidMount() {
        const {page, hasMoreItems, navigation, loadRootComments} = this.props;
        let storyId = JSON.stringify(navigation.getParam("storyId", "NO-ID"));
        let commentCount = JSON.stringify(
            navigation.getParam("commentsCount", "0"),
        );
        loadRootComments(storyId, commentCount, hasMoreItems, page);
    }

    render() {
        return <View></View>;
    }
}

const mapStateToProps = state => ({
    comments: state.commentList.comments,
    page: state.commentList.page,
    hasMoreItems: state.commentList.hasMoreItems,
});

export default connect(
    mapStateToProps,
    {loadRootComments},
)(CommentList);
