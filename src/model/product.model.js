import {Schema, model} from 'mongoose';

export const Product = model(
    'Product',
    new Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        images: [{
            url: {
                type: String,
            }
        }],
        price: {
            type: Number,
            required: true,
            trim: true,
            default: 0,
            validate: (value) => {
                if (value < 0) throw new Error('Invalid price');
            }
        },
        salePrice: {
            type: Number,
            trim: true,
            default: 0,
            validate: (value) => {
                if (value < 0) throw new Error('Invalid sale price');
            }
        },
        quantity: {
            type: Number,
            required: true,
            trim: true,
            default: 0,
            validate: (value) => {
                if (value < 0) throw new Error('Invalid quantity');
            }
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }
    }, {
        timestamps: true
    })
)