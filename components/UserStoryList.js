import React, {Component} from "react";
import {connect} from "react-redux";
import {View, FlatList} from "react-native";
import Story from "./Story";
import StoryForm from "./StoryForm";

class UserStoryList extends Component {
    render() {
        const {currentUser} = this.props.auth;
        const {stories} = this.props.stories;
        return (
            <View>
                <StoryForm />
                <FlatList
                    data={stories}
                    renderItem={({story}) => (
                        <Story key={story.id} story={story} />
                    )}
                    keyExtractor={story => story.id}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    stories: state.content.stories,
});

export default connect(mapStateToProps)(UserStoryList);
