import React, {Component} from "react";
import {View, StyleSheet, Image} from "react-native";

class Comment extends Component {
    render() {
        const {comment} = this.props;
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
                        <Text style={{fontSize: 12}}>
                            @{comment.user.handle}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
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
});

export default Comment;
