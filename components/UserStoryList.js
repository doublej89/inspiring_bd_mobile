import React, {Component} from "react";
import {connect} from "react-redux";
import {View, FlatList, ActivityIndicator, Dimensions} from "react-native";
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
        console.log("Stories");
        console.log(stories);
        const dimensions = Dimensions.get("window");
        const screenWidth = dimensions.width;
        const screenHeight = dimensions.height;
        return (
            <FlatList
                contentContainerStyle={{
                    flex: 1,
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                }}
                data={stories}
                renderItem={({item}) => <Story story={item} />}
                keyExtractor={item => item.id.toString()}
                onEndReached={() => loadItems(page)}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                onRefresh={this._handleRefresh}
                refreshing={refreshing}
            />
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
