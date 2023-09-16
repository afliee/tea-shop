import mongoose from "mongoose";

import validator from "validator/es";

export const User = mongoose.model(
    'User',
    new mongoose.Schema({
        email: {
            type: String,
            required: true,
            trim: true,
            validate: (value) => {
                if (!validator.isEmail(value)) throw new Error('Invalid email address');
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            length: {min: 8, max: 32},
            validate: (value) => {
                if (!validator.isStrongPassword(value)) throw new Error('Invalid password');
            }
        },
        role: [{
            type: String,
            enum: ['user', 'admin', 'customer_scare', 'post_manager'],
            default: 'user'
        }],
        token: {
            type: String,
        }
    }, {
        timestamps: true
    })
)