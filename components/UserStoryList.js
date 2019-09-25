import React, {Component} from "react";
import {connect} from "react-redux";
import {View, FlatList, ActivityIndicator} from "react-native";
import Story from "./Story";
import StoryForm from "./StoryForm";
import {loadItems, refreshPage} from "../actions/content";

class UserStoryList extends Component {
    componentDidMount() {
        const {page} = this.props;
        this.props.loadItems(page);
    }

    _handleRefresh = () => {
        this.props.refreshPage();
        this.props.loadItems(1);
    };

    render() {
        const {currentUser} = this.props.auth;
        const {stories, page, loadItems, refreshing} = this.props;
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#F8F9FF",
                }}>
                <StoryForm />
                <FlatList
                    data={stories}
                    renderItem={({story}) => (
                        <Story key={story.id} story={story} />
                    )}
                    keyExtractor={story => story.id}
                    onEndReached={() => loadItems(page)}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={10}
                    onRefresh={this._handleRefresh}
                    refreshing={refreshing}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    stories: state.content.stories,
    page: state.content.page,
    hasMoreItems: state.content.hasMoreItems,
    refreshing: state.content.refreshing,
});

export default connect(
    mapStateToProps,
    {loadItems, refreshPage},
)(UserStoryList);
