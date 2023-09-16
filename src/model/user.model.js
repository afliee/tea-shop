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
            required: true
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