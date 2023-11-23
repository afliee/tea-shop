import {Schema, model} from 'mongoose';

import {OrderStatus} from "#root/contants/order.status.js";
import {PaymentMethod} from "#root/contants/payment.method.js";

export const Order = model(
    'Order',
    new Schema({
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        note: {
            type: String
        },
        isPaid: {
            type: Boolean,
            default: false
        },
        paymentMethod: {
            type: String,
            enum: [...Object.keys(PaymentMethod)],
            default: PaymentMethod.CASH
        },
        surcharge: {
            type: Number,
            default: 0
        },
        products: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                require: true
            }
        }],
        amount: {
            type: Number,
            require: true
        },
        total: {
            type: Number,
            require: true,
            default: 0
        },
        status: {
            type: String,
            enum: [...Object.keys(OrderStatus)],
            default: OrderStatus.PENDING
        },
        address: {
            type: String,
            require: true
        }
    }, {
        timestamps: true
    })
)