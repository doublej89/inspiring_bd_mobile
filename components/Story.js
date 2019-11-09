import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
} from "react-native";
import TimeAgo from "react-native-timeago";
import {cleanHtml} from "../utils";
import LovedIcon from "../assets/icons/loved.svg";
import CommentIcon from "../assets/icons/comment.svg";
import FollowIcon from "../assets/icons/follow.svg";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faHeart, faEllipsisV} from "@fortawesome/free-solid-svg-icons";
import {handleInspired} from "../actions/content";
import {connect} from "react-redux";

function Story(props) {
    let {
        story,
        navigation,
        handleInspired,
        currentUserId,
        authToken,
        toggleEditMenu,
    } = props;
    let {user} = story;

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
                    {story.user.id !== currentUserId ? (
                        <FollowIcon
                            style={{marginLeft: "auto", marginBottom: 15}}
                        />
                    ) : (
                        <View style={{flexDirection: "row"}}>
                            <FollowIcon
                                style={{marginLeft: "auto", marginBottom: 15}}
                            />
                            <TouchableOpacity
                                onPress={() =>
                                    toggleEditMenu(
                                        true,
                                        story.id,
                                        story.description,
                                        story.photos[0].url,
                                    )
                                }>
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </TouchableOpacity>
                        </View>
                    )}
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
                        //this._panel.show();
                        navigation.navigate("CommentsList", {
                            storyId: story.id,
                            commentsCount: story.comments_count,
                        });
                    }}>
                    <View style={styles.singlePostStat}>
                        <LovedIcon
                            style={{height: 30, width: 30, color: "red"}}
                        />
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
                <TouchableOpacity
                    onPress={() =>
                        handleInspired(story.id, currentUserId, authToken)
                    }>
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
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 10,
                                marginLeft: 10,
                                width: 30,
                                height: 30,
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
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
    currentUserId: state.auth.currentUserId,
    authToken: state.auth.authToken,
});

export default connect(
    mapStateToProps,
    {handleInspired},
)(Story);
