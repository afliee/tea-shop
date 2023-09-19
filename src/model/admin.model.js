import {Schema, model} from 'mongoose';

import validator from "validator/es";
export const Admin = model(
    'Admin',
    new Schema({
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
            length: {min: 8, max: 32},
            validate: (value) => {
                if (!validator.isStrongPassword(value)) throw new Error('Invalid password');
            }
        },
        role: {
            type: String,
            enum: ['admin', 'customer_scare', 'post_manager'],
            default: 'admin'
        },
        token: {
            type: String,
        },
        refreshToken: {
            type: String,
        }
    }, {
        timestamps: true
    })
)