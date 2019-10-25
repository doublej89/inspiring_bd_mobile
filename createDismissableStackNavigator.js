import React, {Component} from "react";
import {createStackNavigator} from "react-navigation-stack";
import {NavigationActions} from "react-navigation";

export function createDismissableStackNavigator(routes, options) {
    const StackNav = createStackNavigator(routes, options);

    return class DismissableStackNav extends Component {
        static router = StackNav.router;

        render() {
            const {state, dispatch} = this.props.navigation;
            const backAction = NavigationActions.back({key: state.key});
            const props = {
                ...this.props.screenProps,
                dismiss: () => dispatch(backAction),
            };
            return (
                <StackNav
                    screenProps={props}
                    navigation={this.props.navigation}
                />
            );
        }
    };
}
