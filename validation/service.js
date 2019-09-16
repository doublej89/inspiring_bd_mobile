import validatejs from "validate.js";
import {validationDictionary} from "./dictionary";

function validateInput({type, value}) {
    let result;
    if (type === "confirmPassword") {
        result = validatejs(
            {
                password: value[0],
                [type]: value[1],
            },
            {
                [type]: validationDictionary[type],
            },
        );
    } else {
        result = validatejs(
            {
                [type]: value,
            },
            {
                [type]: validationDictionary[type],
            },
        );
    }
    if (result) {
        return result[type][0];
    }
    return null;
}

function getInputValidationState({input, value}) {
    let inputValue = typeof value === "object" ? value[1] : value;
    return {
        ...input,
        value: inputValue,
        errorLabel: input.optional
            ? null
            : validateInput({type: input.type, value}),
    };
}

function onInputChange({key, value, cb = () => {}}) {
    const {inputs} = this.state;
    let validatedInputState;
    if (key === "confirmPassword") {
        validatedInputState = getInputValidationState({
            input: inputs[key],
            value: [inputs["password"].value, value],
        });
    } else {
        validatedInputState = getInputValidationState({
            input: inputs[key],
            value,
        });
    }
    this.setState(
        {
            inputs: {
                ...inputs,
                [key]: validatedInputState,
            },
        },
        cb,
    );
}

function getFormValidation() {
    const {inputs} = this.state;
    const updatedInputs = {};
    for (const [key, input] of Object.entries(inputs)) {
        updatedInputs[key] = getInputValidationState({
            input,
            value: input.value,
        });
    }
    this.setState({inputs: updatedInputs});
}

export const validationService = {
    validateInput,
    getInputValidationState,
    onInputChange,
    getFormValidation,
};
