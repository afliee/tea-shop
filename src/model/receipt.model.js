import {Schema, model} from 'mongoose';

import {ReceiptStatus} from "#root/contants/receipt.status.js";
import {PaymentMethod} from "#root/contants/payment.method.js";

export const Receipt = model(
    'Receipt',
    new Schema({
        name: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            required: true
        },
        updatedAt: {
            type: Date,
            default: Date.now(),
            required: true
        },
        items: [{
        //    ref to Product and add more than fields
            type: Schema.Types.ObjectId,
            ref: 'Product',
        }],
        paymentMethod: {
            type: String,
            enum: [...Object.keys(PaymentMethod)],
            default: PaymentMethod.CASH
        },
        amount: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        supplier: {
            type: Schema.Types.ObjectId,
            ref: 'Supplier',
        },
        status: {
            type: String,
            enum: [...Object.keys(ReceiptStatus)],
            default: ReceiptStatus.PENDING,
        }
    }, {
        timestamps: true
    })
)