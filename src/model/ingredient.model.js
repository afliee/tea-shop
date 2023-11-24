import { Schema, model } from "mongoose";
import { Roles } from "#root/contants/roles.js";

export const Ingredient = model(
    "Ingredient",
    new Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            trim: true,
            default: 0,
            validate: ( value ) => {
                if (value < 0) throw new Error("Invalid quantity");
            },
        },
        unit: {
            type: String,
            enum: ["kg", "g", "l", "ml"],
            default: "kg",
        },
        price: {
            type: Number,
            required: true,
            trim: true,
            default: 0,
            validate: ( value ) => {
                if (value < 0) throw new Error("Invalid price");
            },
        },
        note: {
            type: String,
            trim: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        expiredAt: {
            type: Date,
            required: true,
        }
    }, {
        timestamps: true,
    }));