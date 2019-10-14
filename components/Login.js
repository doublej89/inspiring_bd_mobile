import React, {Component} from "react";
import {
    StyleSheet,
    TextInput,
    ScrollView,
    Text,
    View,
    Button,
} from "react-native";

import {connect} from "react-redux";
import {login} from "../actions/auth";
import {validationService} from "../validation/service";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputs: {
                email: {
                    type: "email",
                    value: "",
                },
                password: {
                    type: "password",
                    value: "",
                },
            },
        };

        this.onInputChange = validationService.onInputChange.bind(this);
        //this.getFormValidation = validationService.getFormValidation.bind(this);
        this.onLoginPressed = this.onLoginPressed.bind(this);
    }

    onLoginPressed() {
        const {inputs} = this.state;
        const {login} = this.props;
        const submittedInputs = {};
        const credentials = {};
        for (const [key, input] of Object.entries(inputs)) {
            if (input.errorLabel) return;
            submittedInputs[key] = {
                ...input,
                value: "",
            };
            credentials[key] = input.value;
        }
        this.setState({inputs: submittedInputs}, () => {
            login(credentials, this.props.navigation);
        });
    }

    renderError(key) {
        const {inputs} = this.state;
        if (inputs[key].errorLabel) {
            return <Text style={styles.error}>{inputs[key].errorLabel}</Text>;
        }
        return null;
    }

    render() {
        const {auth} = this.props;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View>
                        <Text>Email</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={value => {
                                this.onInputChange({key: "email", value});
                            }}
                        />
                        {this.renderError("email")}
                    </View>
                    <View>
                        <Text>Password</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry={true}
                            onChangeText={value => {
                                this.onInputChange({key: "password", value});
                            }}
                        />
                        {this.renderError("password")}
                    </View>
                </ScrollView>
                <Text>Don't have an account?</Text>
                <Text
                    onPress={() => this.props.navigation.navigate("Register")}>
                    Register
                </Text>
                {auth && auth.loginError ? (
                    <Text style={{color: "red"}}>{auth.loginError}</Text>
                ) : null}
                <View style={styles.button}>
                    <Button title="Submit Form" onPress={this.onLoginPressed} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        paddingTop: 50,
    },
    input: {
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        marginBottom: 15,
        alignSelf: "stretch",
    },
    split: {
        flexDirection: "row",
    },
    error: {
        position: "absolute",
        bottom: 0,
        color: "red",
        fontSize: 12,
    },
    button: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 20,
    },
});

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps,
    {login},
)(Login);
