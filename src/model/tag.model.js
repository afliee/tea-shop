import {Schema, model} from "mongoose";

export const Tag = model(
    'Tag',
    new Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        stories: [{
            type: Schema.Types.ObjectId,
            ref: 'Story'
        }]
    }, {
        timestamps: true
    })
)