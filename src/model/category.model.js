import {Schema, model} from 'mongoose';

export const Category = model(
    'Category',
    new Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        }
    }, {
        timestamps: true
    })
)