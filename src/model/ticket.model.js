import {Schema, model} from "mongoose";

export const Ticket = model(
    'Ticket',
    new Schema({
        subject: {
            type: String,
            required: true,
            trim: true,
            maxLength: 255
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxLength: 255
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
        },
        email: {
            type: String,
            required: true,
            trim: true,
            maxLength: 255
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: Date,
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    })
)