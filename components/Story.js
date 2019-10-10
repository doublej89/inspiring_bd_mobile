import React, {Component} from "react";
import {View, Text, Image, StyleSheet, TouchableHighlight} from "react-native";
import {connect} from "react-redux";
import TimeAgo from "react-native-timeago";
import {cleanHtml} from "../utils";
import LovedIcon from "../assets/icons/loved.svg";
import CommentIcon from "../assets/icons/comment.svg";
import FollowIcon from "../assets/icons/follow.svg";
import SlidingUpPanel from "rn-sliding-up-panel";
import {
    loadRootComments,
    submitComment,
    setCommentCount,
} from "../actions/content";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";

class Story extends Component {
    componentDidMount() {
        const {story, setCommentCount} = this.props;
        setCommentCount(story.comments_count);
    }

    render() {
        const {currentUser} = this.props.auth;
        let {story, commentCount} = this.props;
        let user = story.user;
        story.comments_count = commentCount;
        //let {user} = story;

        return (
            <View style={styles.postContainer}>
                <View style={styles.postCard}>
                    {story && story.photos[0] && (
                        <Image
                            source={{uri: story.photos[0].url}}
                            style={styles.cardImgTop}
                        />
                    )}
                </View>
                <View style={styles.singlePostContent}>
                    <View style={styles.singlePostUser}>
                        {story && story.user && (
                            <Image
                                source={{uri: user.avatar_url}}
                                style={styles.profileImage}
                            />
                        )}
                        <View style={{padding: 4, marginLeft: 10}}>
                            {story.user && (
                                <Text
                                    style={{
                                        fontSize: 14,
                                        marginBottom: 0,
                                    }}>
                                    {user.name}
                                </Text>
                            )}
                            {story.user && (
                                <Text
                                    style={{
                                        color: "#84A6F6",
                                        fontSize: 16,
                                    }}>
                                    @{user.handle}
                                </Text>
                            )}
                        </View>
                        <FollowIcon
                            style={{marginLeft: "auto", marginBottom: 15}}
                        />
                    </View>
                    <TimeAgo
                        time={story.created_at}
                        style={{marginLeft: 10, marginRight: 10, fontSize: 12}}
                    />
                    <Text style={{color: "#7A7979", marginTop: 5}}>
                        {cleanHtml(story.description)}
                    </Text>
                    <TouchableHighlight
                        onPress={() =>
                            this.props.navigation.navigate("Comments", {
                                storyId: story.id,
                                commentsCount: story.comments_count,
                            })
                        }>
                        <View style={styles.singlePostStat}>
                            <LovedIcon />
                            <Text>{story.inspirations_count}</Text>
                            <CommentIcon />
                            <Text>{story.comments_count}</Text>
                        </View>
                    </TouchableHighlight>
                    <View
                        style={{
                            backgroundColor: "#D8D8D8",
                            height: 1,
                        }}></View>
                    <View
                        style={{
                            flexDirection: "row",
                            paddingHorizontal: 15,
                            paddingBottom: 15,
                            paddingTop: 0,
                        }}>
                        <TouchableHighlight onPress={() => {}}>
                            <FontAwesomeIcon
                                icon={faHeart}
                                style={{
                                    fontSize: 28,
                                    marginTop: 10,
                                    marginBottom: 10,
                                    marginRight: 10,
                                    marginLeft: 10,
                                }}
                            />
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    postContainer: {
        marginBottom: 20,
        borderRadius: 10,
        flexDirection: "column",
        backgroundColor: "#fff",
    },
    postCard: {
        flex: 1,
        width: 400,
        height: 250,
    },
    cardImgTop: {
        width: "100%",
        height: "100%",
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
    },
    singlePostContent: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        color: "#4E4B4B",
        flex: 1,
    },
    singlePostUser: {
        flexDirection: "row",
    },
    profileImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    singlePostStat: {
        flexDirection: "row",
        marginLeft: 0,
        width: "100%",
    },
});

const mapStateToProps = state => ({
    auth: state.auth,
    comments: state.commentList.comments,
    page: state.commentList.page,
    newCommentContent: state.commentList.newCommentContent,
    hasMoreItems: state.commentList.hasMoreItems,
    commentCount: state.commentList.commentCount,
});

export default connect(
    mapStateToProps,
    {loadRootComments, submitComment, setCommentCount},
)(Story);
