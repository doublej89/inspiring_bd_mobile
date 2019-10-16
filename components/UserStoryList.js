import React, {Component} from "react";
import {connect} from "react-redux";
import {
    View,
    FlatList,
    ActivityIndicator,
    Dimensions,
    PanResponder,
    Animated,
} from "react-native";
import Story from "./Story";
import StoryForm from "./StoryForm";
import Comment from "./Comment";
import {
    loadItems,
    refreshPage,
    loadRootComments,
    submitComment,
    closeCommentList,
} from "../actions/content";
import SlidingUpPanel from "rn-sliding-up-panel";

class UserStoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newCommentContent: "",
            dragPanel: true,
            selectedStory: null,
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
        const {storiesPage} = this.props;
        this.props.loadItems(storiesPage);
    }

    componentDidUpdate(prevProps) {
        const {
            stories,
            comments,
            selectedStoryId,
            loadRootComments,
            hasMoreItems,
            commentsPage,
        } = this.props;

        if (selectedStoryId !== null) {
            let selectedStory;
            if (this.state.selectedStory) {
                selectedStory = this.state.selectedStory;
                if (comments.length - prevProps.comments.length === 1) {
                    selectedStory.comments_count += 1;
                    this.setState({selectedStory: selectedStory});
                }
            } else {
                selectedStory = stories.find(
                    story => story.id === selectedStoryId,
                );
                this.setState({selectedStory: selectedStory});
            }
            if (comments === null) {
                loadRootComments(
                    selectedStoryId,
                    selectedStory.comments_count,
                    hasMoreItems,
                    commentsPage,
                );
            }
            this._panel.show();
        } else {
            if (this.state.selectedStory !== null) {
                this.setState({selectedStory: null});
            }
        }
    }

    _handleRefresh = () => {
        this.props.refreshPage();
        this.props.loadItems(1);
    };

    _onGrant() {
        this.setState({dragPanel: false});
        return true;
    }

    _onRelease() {
        this.setState({dragPanel: true});
    }

    handleCommentSubmission(evt) {
        const {submitComment, authToken} = this.props;
        const {newCommentContent, selectedStory} = this.state;
        if (evt.nativeEvent.key === "Enter") {
            this.setState({newCommentContent: ""}, () => {
                submitComment(
                    newCommentContent,
                    selectedStory.id,
                    selectedStory.comments_count,
                    authToken,
                );
            });
        }
    }

    handleSubmitEditing(evt) {
        const {text} = evt.nativeEvent;
        const {submitComment, authToken} = this.props;
        const {selectedStory} = this.state;
        this.setState({newCommentContent: ""}, () => {
            submitComment(
                text,
                selectedStory.id,
                selectedStory.comments_count,
                authToken,
            );
        });
    }

    render() {
        const {
            stories,
            storiesPage,
            loadItems,
            refreshing,
            loading,
            commentsPage,
            comments,
            hasMoreItems,
            closeCommentList,
        } = this.props;
        const dimensions = Dimensions.get("window");
        const screenWidth = dimensions.width;
        const screenHeight = dimensions.height;
        const animatedValue = new Animated.Value(0);
        animatedValue.addListener(({value}) => {
            if (value === 0) {
                closeCommentList();
            }
        });
        return !loading ? (
            <View>
                <FlatList
                    data={stories}
                    renderItem={({item}) => <Story story={item} />}
                    keyExtractor={item => item.id.toString()}
                    onEndReached={() => loadItems(storiesPage)}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={10}
                    onRefresh={this._handleRefresh}
                    refreshing={refreshing}
                />
                <SlidingUpPanel
                    allowDragging={this.state.dragPanel}
                    animatedValue={animatedValue}
                    ref={c => (this._panel = c)}>
                    <View
                        style={{flexDirection: "column"}}
                        {...this._panResponder.panHandlers}>
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
                </SlidingUpPanel>
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
    comments: state.commentList.comments,
    commentsPage: state.commentList.commentsPage,
    hasMoreItems: state.commentList.hasMoreItems,
    selectedStoryId: state.commentList.selectedStoryId,
    refreshing: state.content.refreshing,
});

export default connect(
    mapStateToProps,
    {loadItems, refreshPage, loadRootComments, submitComment, closeCommentList},
)(UserStoryList);
