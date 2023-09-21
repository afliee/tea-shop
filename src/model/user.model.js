import mongoose from "mongoose";

import validator from 'validator';

import {Roles} from "#root/contants/roles.js";

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
        active: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: [...Object.keys(Roles)],
            default: Roles.USER
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