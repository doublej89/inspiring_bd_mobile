import React, {Component} from "react";
import {Text, View, TextInput, StyleSheet, Button} from "react-native";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputs: {
                name: {
                    type: "name",
                    value: "",
                },
                email: {
                    type: "email",
                    value: "",
                },
                password: {
                    type: "password",
                    value: "",
                },
                confirmPassword: {
                    type: "confirmPassword",
                    value: "",
                },
            },
        };
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
                <View>
                    <Text>Name</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={value => {
                            this.onInputChange({key: "name", value});
                        }}
                    />
                    {this.renderError("email")}
                </View>
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
                <View>
                    <Text>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={value => {
                            this.onInputChange({key: "confirmPassword", value});
                        }}
                    />
                    {this.renderError("confirmPassword")}
                </View>
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

export default Register;
