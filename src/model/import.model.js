import {Schema, model} from "mongoose";

const Import = model(
    'Import',
    new Schema({
        supplier: {
            type: Schema.Types.ObjectId,
            ref: 'Supplier'
        },
        products: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            }
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
    })
)