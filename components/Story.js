import React, {Component} from "react";
import {View, Text, Image, StyleSheet} from "react-native";
import {connect} from "react-redux";
import TimeAgo from "react-native-timeago";

class Story extends Component {
    render() {
        const {currentUser} = this.props.auth;
        let {story} = this.props;
        let {user} = story;
        return (
            <View style={styles.postContainer}>
                <View style={styles.postCard}>
                    {story.photos[0] && (
                        <Image
                            source={{uri: story.photos[0].url}}
                            style={styles.cardImgTop}
                        />
                    )}
                </View>
                <View style={styles.singlePostContent}>
                    <View style={styles.singlePostUser}>
                        <Image
                            source={{uri: user.avatar_url}}
                            style={styles.profileImage}
                        />
                        <View style={{padding: "1%", marginLeft: 10}}>
                            <Text style={{fontSize: "1rem", marginBottom: 0}}>
                                {user.name}
                            </Text>
                            <Text style={{color: "#84A6F6", fontSize: 16}}>
                                @{user.handle}
                            </Text>
                        </View>
                        <Image
                            source={require("../assets/icons/follow.svg")}
                            style={{
                                marginLeft: "auto",
                                marginBottom: 15,
                                maxWidth: "100%",
                            }}
                        />
                    </View>
                    <TimeAgo
                        time={story.created_at}
                        style={{margin: "0 10px", fontSize: 12}}
                    />
                    <Text style={{color: "#7A7979", marginTop: ".5rem"}}>
                        {story.description}
                    </Text>
                    <View style={styles.singlePostStat}>
                        <Image
                            source={require("../assets/icons/loved.svg")}
                            style={{padding: "0 10px 0 25px"}}
                        />
                    </View>
                    <View
                        style={{backgroundColor: "#D8D8D8", height: 1}}></View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    postContainer: {
        marginBottom: 20,
        boxShadow: "0 4px 7px rgba(0,0,0,0.07)",
    },
    postCard: {
        borderRadius: 10,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        wordWrap: "break-word",
        backgroundColor: "#fff",
        border: "1px solid rgba(0,0,0,0.125)",
    },
    cardImgTop: {
        width: "100%",
        borderTopLeftRadius: "calc(10px - 1px)",
        borderTopRightRadius: "calc(10px - 1px)",
    },
    singlePostContent: {
        padding: "15px 15px",
        color: "#4E4B4B",
    },
    singlePostUser: {
        display: "flex",
        flexDirection: "row",
    },
    profileImage: {
        height: 50,
        width: 50,
        borderRadius: "50%",
    },
    singlePostStat: {
        display: "flex",
        flexDirection: "row",
        marginLeft: 0,
        width: "100%",
    },
});

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps)(Story);
