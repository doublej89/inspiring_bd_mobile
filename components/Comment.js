import React from "react";
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
} from "react-native";
import ReplyIcon from "../assets/icons/reply.svg";
import CommentIcon from "../assets/icons/comment.svg";
import {cleanHtml} from "../utils";
import TimeAgo from "react-native-timeago";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faEllipsisV} from "@fortawesome/free-solid-svg-icons";

function Comment(props) {
    const {
        comment,
        navigation,
        replyToReply,
        toggleEditMenu,
        currentUser,
    } = props;
    return (
        <View style={styles.commentContainer}>
            <View style={{flexDirection: "row"}}>
                <Image
                    source={{uri: comment.user.avatar_url}}
                    style={styles.profilePic}
                />
                <View style={{marginStart: 10}}>
                    <Text style={{fontSize: 16, fontWeight: "bold"}}>
                        {comment.user.name}
                    </Text>
                    <Text style={{fontSize: 12}}>@{comment.user.handle}</Text>
                </View>
            </View>
            <View style={styles.commentBody}>
                <View style={{flexDirection: "row"}}>
                    <Text style={styles.commentText}>
                        {cleanHtml(comment.body)}
                    </Text>
                    {currentUser && (
                        <TouchableOpacity
                            onPress={() => {
                                if (comment.parent_id) {
                                    toggleEditMenu(
                                        true,
                                        comment.id,
                                        comment.body,
                                        comment.parent_id,
                                    );
                                } else {
                                    toggleEditMenu(
                                        true,
                                        comment.id,
                                        comment.body,
                                    );
                                }
                            }}>
                            <View style={{flex: 0.1, alignSelf: "flex-start"}}>
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>
                    <View style={{flexDirection: "row"}}>
                        <View style={{flexDirection: "row"}}>
                            <ReplyIcon style={styles.actionIcon} />
                            <Text style={{fontSize: 14, color: "#535454"}}>
                                Reply
                            </Text>
                        </View>
                    </View>
                    <TimeAgo time={comment.created_at} style={styles.timeAgo} />
                    <View style={{flexDirection: "row"}}>
                        <TouchableNativeFeedback
                            onPress={() => {
                                if (comment.parent_id) {
                                    replyToReply(comment.user.name);
                                } else {
                                    navigation.navigate("RepliesList", {
                                        storyId: comment.story_id,
                                        commentId: comment.id,
                                        repliesCount: comment.replies_count,
                                    });
                                }
                            }}>
                            <View style={{flexDirection: "row"}}>
                                <CommentIcon style={styles.actionIcon} />
                                {comment.parent_id && (
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: "#535454",
                                        }}>
                                        {comment.replies_count}
                                    </Text>
                                )}
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    commentContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    profilePic: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    commentBody: {
        backgroundColor: "#efeeee",
        borderRadius: 10,
        padding: 15,
    },
    commentText: {
        fontSize: 14,
        marginBottom: 15,
        color: "#535454",
        flex: 0.9,
        alignSelf: "stretch",
    },

    actionIcon: {
        width: 25,
        height: 25,
        marginHorizontal: 5,
    },
    timeAgo: {
        marginHorizontal: 10,
        fontSize: 12,
        color: "#535454",
    },
});

export default Comment;
