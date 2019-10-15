import React, {Component} from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableHighlight,
    FlatList,
    TextInput,
    PanResponder,
} from "react-native";
import {connect} from "react-redux";
import TimeAgo from "react-native-timeago";
import {cleanHtml} from "../utils";
import LovedIcon from "../assets/icons/loved.svg";
import CommentIcon from "../assets/icons/comment.svg";
import FollowIcon from "../assets/icons/follow.svg";
import SlidingUpPanel from "rn-sliding-up-panel";
import Comment from "./Comment";
import {
    loadRootComments,
    submitComment,
    setCommentCount,
} from "../actions/content";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";

class Story extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCommentContent: "",
            dragPanel: true,
        };
        this._onGrant = this._onGrant.bind(this);
        this._onRelease = this._onRelease.bind(this);
        this.handleCommentSubmission = this.handleCommentSubmission.bind(this);
        this.handleSubmitEditing = this.handleSubmitEditing.bind(this);
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._onGrant,
            onMoveShouldSetPanResponder: this._onGrant,
            onPanResponderRelease: this._onRelease,
            onPanResponderTerminate: this._onRelease,
        });
    }

    componentDidMount() {
        const {story, setCommentCount} = this.props;
        setCommentCount(story.comments_count);
    }

    _onGrant() {
        this.setState({dragPanel: false});
        return true;
    }

    _onRelease() {
        this.setState({dragPanel: true});
    }

    handleCommentSubmission(evt) {
        const {submitComment, story, authToken} = this.props;
        const {newCommentContent} = this.state;
        if (evt.nativeEvent.key === "Enter") {
            this.setState({newCommentContent: ""}, () => {
                submitComment(
                    newCommentContent,
                    story.id,
                    story.comments_count,
                    authToken,
                );
            });
        }
    }

    handleSubmitEditing(evt) {
        const {text} = evt.nativeEvent;
        const {story, submitComment, authToken} = this.props;
        this.setState({newCommentContent: ""}, () => {
            submitComment(text, story.id, story.comments_count, authToken);
        });
    }

    render() {
        let {
            story,
            commentCount,
            comments,
            loadRootComments,
            page,
            hasMoreItems,
        } = this.props;
        let {user} = story;
        story.comments_count = commentCount;
        console.log("Number of comments: " + story.comments_count);

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
                                source={{uri: story.user.avatar_url}}
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
                                    {story.user.name}
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
                        style={{
                            marginLeft: 10,
                            marginRight: 10,
                            fontSize: 12,
                        }}
                    />
                    <Text style={{color: "#7A7979", marginTop: 5}}>
                        {cleanHtml(story.description)}
                    </Text>
                    <TouchableHighlight
                        onPress={() => {
                            loadRootComments(
                                story.id,
                                story.comments_count,
                                hasMoreItems,
                                page,
                            );
                            //this._panel.show();
                        }}>
                        <View style={styles.singlePostStat}>
                            <LovedIcon style={{height: 30, width: 30}} />
                            <Text>{story.inspirations_count}</Text>
                            <CommentIcon style={{height: 30, width: 30}} />
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
                            marginTop: 15,
                        }}>
                        <FontAwesomeIcon
                            icon={faHeart}
                            style={{
                                fontSize: 50,
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 10,
                                marginLeft: 10,
                            }}
                        />
                    </View>
                </View>
                {/* <SlidingUpPanel
                    allowDragging={this.state.dragPanel}
                    ref={c => (this._panel = c)}>
                    <View
                        style={{flex: 1, flexDirection: "column"}}
                        {...this._panResponder.panHandlers}>
                        <FlatList
                            contentContainerStyle={{
                                flex: 1,
                                flexDirection: "column",
                            }}
                            data={comments}
                            renderItem={({item}) => (
                                <Comment
                                    {...this._panResponder.panHandlers}
                                    comment={item}
                                />
                            )}
                            keyExtractor={item => item.id.toString()}
                            onEndReached={() =>
                                loadRootComments(story.id, hasMoreItems, page)
                            }
                            onEndReachedThreshold={0.5}
                            initialNumToRender={10}
                            {...this._panResponder.panHandlers}
                        />
                        <TextInput
                            onKeyPress={this.handleCommentSubmission}
                            onChangeText={value =>
                                this.setState({newCommentContent: value})
                            }
                            onSubmitEditing={this.handleSubmitEditing}
                        />
                    </View>
                </SlidingUpPanel> */}
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
        paddingHorizontal: 15,
        paddingVertical: 15,
        color: "#4E4B4B",
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
        height: 40,
        marginTop: 15,
        justifyContent: "space-around",
    },
});

const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    comments: state.commentList.comments,
    page: state.commentList.page,
    hasMoreItems: state.commentList.hasMoreItems,
    commentCount: state.commentList.commentCount,
});

export default connect(
    mapStateToProps,
    {loadRootComments, submitComment, setCommentCount},
)(Story);
