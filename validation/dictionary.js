export const validationDictionary = {
    name: {
        presence: {
            allowEmpty: false,
            message: "^Name is required",
        },
    },
    email: {
        presence: {
            allowEmpty: false,
            message: "^Email is required",
        },
        email: {
            message: "^Email address must be valid",
        },
    },
    password: {
        presence: {
            allowEmpty: false,
            message: "^This is required",
        },
        length: {
            minimum: 6,
            message: "^Password must be at least 6 characters long",
        },
    },
    confirmPassword: {
        equality: "password",
    },
};
