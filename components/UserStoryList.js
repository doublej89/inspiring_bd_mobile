import React, {Component} from "react";
import {connect} from "react-redux";
import {View, FlatList, ActivityIndicator, Button} from "react-native";
import Story from "./Story";
import StoryForm from "./StoryForm";
import Comment from "./Comment";
import LogoutButton from "./LogoutButton";
import {loadItems, refreshPage} from "../actions/content";
import {logout} from "../actions/auth";
import LogoTitle from "./LogoTitle";

class UserStoryList extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: () => <LogoTitle />,
            headerRight: <LogoutButton navigation={navigation} />,
        };
    };
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         newCommentContent: "",
    //         dragPanel: true,
    //         selectedStory: null,
    //     };
    //     this._onGrant = this._onGrant.bind(this);
    //     this._onRelease = this._onRelease.bind(this);
    //     this.handleCommentSubmission = this.handleCommentSubmission.bind(this);
    //     this.handleSubmitEditing = this.handleSubmitEditing.bind(this);
    //     this._panResponder = PanResponder.create({
    //         onStartShouldSetPanResponder: this._onGrant,
    //         onMoveShouldSetPanResponder: this._onGrant,
    //         onPanResponderRelease: this._onRelease,
    //         onPanResponderTerminate: this._onRelease,
    //     });
    // }

    componentDidMount() {
        this.props.navigation.setParams({logout: this.props.logout});
        const {storiesPage} = this.props;
        this.props.loadItems(storiesPage);
    }

    // componentDidUpdate(prevProps) {
    //     const {
    //         stories,
    //         comments,
    //         selectedStoryId,
    //         loadRootComments,
    //         hasMoreItems,
    //         commentsPage,
    //     } = this.props;

    //     if (selectedStoryId !== null) {
    //         let selectedStory;
    //         if (this.state.selectedStory) {
    //             selectedStory = this.state.selectedStory;
    //             if (comments.length - prevProps.comments.length === 1) {
    //                 selectedStory.comments_count += 1;
    //                 this.setState({selectedStory: selectedStory});
    //             }
    //         } else {
    //             selectedStory = stories.find(
    //                 story => story.id === selectedStoryId,
    //             );
    //             this.setState({selectedStory: selectedStory});
    //         }
    //         if (comments === null) {
    //             loadRootComments(
    //                 selectedStoryId,
    //                 selectedStory.comments_count,
    //                 hasMoreItems,
    //                 commentsPage,
    //             );
    //         }
    //         this._panel.show();
    //     } else {
    //         if (this.state.selectedStory !== null) {
    //             this.setState({selectedStory: null});
    //         }
    //     }
    // }

    _handleRefresh = () => {
        this.props.refreshPage();
        this.props.loadItems(1);
    };

    // _onGrant() {
    //     this.setState({dragPanel: false});
    //     return true;
    // }

    // _onRelease() {
    //     this.setState({dragPanel: true});
    // }

    // handleCommentSubmission(evt) {
    //     const {submitComment, authToken} = this.props;
    //     const {newCommentContent, selectedStory} = this.state;
    //     if (evt.nativeEvent.key === "Enter") {
    //         this.setState({newCommentContent: ""}, () => {
    //             submitComment(
    //                 newCommentContent,
    //                 selectedStory.id,
    //                 selectedStory.comments_count,
    //                 authToken,
    //             );
    //         });
    //     }
    // }

    // handleSubmitEditing(evt) {
    //     const {text} = evt.nativeEvent;
    //     const {submitComment, authToken} = this.props;
    //     const {selectedStory} = this.state;
    //     this.setState({newCommentContent: ""}, () => {
    //         submitComment(
    //             text,
    //             selectedStory.id,
    //             selectedStory.comments_count,
    //             authToken,
    //         );
    //     });
    // }

    render() {
        const {
            stories,
            storiesPage,
            loadItems,
            refreshing,
            loading,
            navigation,
        } = this.props;

        return !loading ? (
            <View>
                <FlatList
                    data={stories}
                    renderItem={({item}) => (
                        <Story story={item} navigation={navigation} />
                    )}
                    keyExtractor={item => item.id.toString()}
                    onEndReached={() => loadItems(storiesPage)}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={10}
                    onRefresh={this._handleRefresh}
                    refreshing={refreshing}
                    extraData={this.props}
                />
                {/* <SlidingUpPanel
                    allowDragging={this.state.dragPanel}
                    animatedValue={animatedValue}
                    ref={c => (this._panel = c)}>
                    <View style={{flexDirection: "column"}}>
                        <FlatList
                            data={comments}
                            renderItem={({item}) => (
                                <Comment
                                    {...this._panResponder.panHandlers}
                                    comment={item}
                                />
                            )}
                            keyExtractor={item => item.id.toString()}
                            onEndReached={() =>
                                loadRootComments(
                                    story.id,
                                    hasMoreItems,
                                    commentsPage,
                                )
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
        ) : (
            <View>
                <Text style={{alignSelf: "center"}}>Loading stories</Text>
                <ActivityIndicator />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    stories: state.content.stories,
    storiesPage: state.content.storiesPage,
    refreshing: state.content.refreshing,
});

export default connect(
    mapStateToProps,
    {loadItems, refreshPage, logout},
)(UserStoryList);
