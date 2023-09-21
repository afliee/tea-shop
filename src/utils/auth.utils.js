import {check} from "express-validator";

export const registerValidator = [
    check("email").isEmail().withMessage("Email is invalid"),
    // custom passworrd validator have to be at least 6 characters and have at least one number and one special character
    check("password").isLength({min: 6})
        .withMessage("Password must be at least 6 characters")
        .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/).withMessage("Password must have at least one number and one special character"),
];

export const loginValidator = [
    check("email").isEmail().withMessage("Email is invalid"),
    check("password").isLength({min: 6}).withMessage("Password must be at least 6 characters"),
];