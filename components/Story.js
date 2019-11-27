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
import HeartIcon from "../assets/icons/love.svg";
import ReplyIcon from "../assets/icons/reply.svg";
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
        seeUserProfile,
    } = props;
    let {user} = story;

    return (
        <View style={styles.postContainer}>
            <View style={styles.postCard}>
                {story && story.photos[story.photos.length - 1] && (
                    <Image
                        source={{
                            uri: story.photos[story.photos.length - 1].url,
                        }}
                        style={styles.cardImgTop}
                    />
                )}
            </View>
            <View style={styles.singlePostContent}>
                <View style={styles.singlePostUser}>
                    <View style={{flexDirection: "row"}}>
                        {story && story.user && (
                            <Image
                                source={{uri: story.user.avatar_url}}
                                style={styles.profileImage}
                            />
                        )}

                        <TouchableOpacity
                            onPress={() => {
                                // navigation.navigate("Profile", {
                                //     userId: user.id,
                                // });
                                seeUserProfile(user.id);
                                navigation.navigate("Profile");
                            }}>
                            <View style={{padding: 4, marginLeft: 10}}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        marginBottom: 0,
                                    }}>
                                    {story.user.name}
                                </Text>
                                <Text
                                    style={{
                                        color: "#84A6F6",
                                        fontSize: 16,
                                    }}>
                                    @{user.handle}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {story.user.id === currentUserId && (
                        <TouchableOpacity
                            onPress={() => {
                                if (story.photos.length > 0) {
                                    toggleEditMenu(
                                        true,
                                        story.id,
                                        story.description,
                                        story.photos[story.photos.length - 1]
                                            .url,
                                    );
                                } else {
                                    toggleEditMenu(
                                        true,
                                        story.id,
                                        story.description,
                                    );
                                }
                            }}>
                            <FontAwesomeIcon icon={faEllipsisV} />
                        </TouchableOpacity>
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
                            writeComment: "no",
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
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}>
                    <TouchableOpacity
                        onPress={() =>
                            handleInspired(story.id, currentUserId, authToken)
                        }>
                        <View
                            style={{
                                flexDirection: "row",
                            }}>
                            {/* <FontAwesomeIcon
                            icon={faHeart}
                            style={{
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 10,
                                marginLeft: 10,
                                width: 30,
                                height: 30,
                            }}
                        /> */}
                            <HeartIcon style={{height: 10, width: 10}} />
                            <Text style={{fontSize: 16}}>Love</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("CommentsList", {
                                storyId: story.id,
                                commentsCount: story.comments_count,
                                writeComment: "yes",
                            });
                        }}>
                        <View
                            style={{
                                flexDirection: "row",
                            }}>
                            {/* <FontAwesomeIcon
                            icon={faHeart}
                            style={{
                                marginTop: 10,
                                marginBottom: 10,
                                marginRight: 10,
                                marginLeft: 10,
                                width: 30,
                                height: 30,
                            }}
                        /> */}
                            <ReplyIcon style={{height: 25, width: 25}} />
                            <Text style={{fontSize: 16}}>Reply</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
        borderRadius: 10,
    },
    cardImgTop: {
        width: "100%",
        height: "100%",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    singlePostContent: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        color: "#4E4B4B",
        backgroundColor: "#fff",
    },
    singlePostUser: {
        flexDirection: "row",
        justifyContent: "space-between",
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

export default connect(mapStateToProps, {handleInspired})(Story);
