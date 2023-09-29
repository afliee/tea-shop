import {Schema, model} from "mongoose";

import validator from "validator/es";

export const Supplier = model(
    'Supplier',
    new Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        contact: {
            type: String
        },
        email: {
            type: String,
            validate: (value) => {
                if (!validator.isEmail(value)) throw new Error('Email invalid!');
            }
        }
    }, {
        timestamps: true
    })
)