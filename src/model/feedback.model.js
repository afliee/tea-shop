import { Schema, model } from "mongoose";
import {FeedbackStatus} from "#root/contants/feedback.status.js";

export const Feedback = model("Feedback", new Schema({
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [FeedbackStatus.PENDING, FeedbackStatus.REPLIED],
        default: FeedbackStatus.PENDING
    }
}, {
    timestamps: true
}));