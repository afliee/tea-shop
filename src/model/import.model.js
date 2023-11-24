import {Schema, model} from "mongoose";

export const Import = model(
    'Import',
    new Schema({
        supplier: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        ingredients: [{
            type: Schema.Types.ObjectId,
            ref: 'Ingredient'
        }],
        total: {
            type: Number,
            required: true,
            trim: true,
            default: 0,
            validate: (value) => {
                if (value < 0) throw new Error('Invalid total');
            }
        },
        note: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    }, {
        timestamps: true
    })
)