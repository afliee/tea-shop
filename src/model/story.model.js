import {Schema, model} from "mongoose";

// import ObjectId


export const Story = model(
    'Story',
    new Schema({
        title: {
            type: String,
            required: true,
            trim: true,
        },
        sortDescription: {
            type: String,
            required: true,
        },
        blockContent: [{
            content: {
                type: String
            },
            url: {
                type: String
            }
        }],
        tags: [{
            type: Schema.Types.ObjectId,
            ref: 'Tag'
        }]
    })
)