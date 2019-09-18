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
        this.setState({inputs: updatedInputs}, () => {
            this.props.login(credentials).then(authToken => {
                if (authToken) this.props.navigation.navigate("App");
            });
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
                <Text>Password</Text>
                <Button
                    title="Register"
                    onPress={() => this.props.navigation("Register")}
                />
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

export default connect(
    null,
    {login},
)(Login);
