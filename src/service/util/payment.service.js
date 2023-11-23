import {Order, User} from '#models/index.js';
import {OrderStatus} from "#root/contants/order.status.js";
import {PaymentMethod} from "#root/contants/payment.method.js";
import {sendEmail} from "#utils/email.utils.js";
import {ProductService} from "#services/index.js";

class PaymentService {
    constructor() {
        this._productService = new ProductService();
    }

    verifyPayment = async (orderId, orderInfo) => {
        if (!orderId) {
            return false;
        }


        const { amount, name, email, note, address, products} = orderInfo;
        console.log("Order Infor");
        console.log(orderInfo);
        const productsDetail =await this._productService.getAllByIds(products.map(product => product.product), ['name', 'price', 'image']);
        console.log(productsDetail)
        productsDetail.forEach((product, index) => {
            product.quantity = products[index].quantity;
        });
        const options = {
            email,
            subject: 'Order success',
            template: 'order-success',
            context: {
                name,
                amount,
                products: productsDetail,
                address
            }
        }
        if (orderId.startsWith('guest')) {
            const user = await User.findOne({ email });
            if (!user) {
                return false;
            }
            const order = await Order.create({
                name: `Order from ${ name }`,
                email,
                note,
                products,
                isPaid: true,
                amount,
                total: products.reduce((total, product) => {
                    return total + product.quantity
                }, 0),
                status: OrderStatus.PENDING,
                paymentMethod: PaymentMethod.VN_PAY,
                address,
            });

            if (!order) {
                return false;
            }

            await sendEmail(options);
            return true;
        } else {
            try {
                const userId = orderId.split('-')[0];
                const user = await User.findById(userId);
                if (!user) {
                    return false;
                }

                const order = await Order.create({
                    name,
                    email,
                    note,
                    products,
                    amount,
                    isPaid: true,
                    total: products.reduce((total, product) => {
                        return total + product.quantity
                    }, 0),
                    status: OrderStatus.PENDING,
                    paymentMethod: PaymentMethod.VN_PAY,
                    address,
                });

                if (!order) {
                    return false;
                }

                user.orders.push(order._id);
                //drop product in cart of user by product id
                user.cart = user.cart.filter(cartItem => {
                    return !products.some(product => {
                        return product.product === cartItem.productId.toString();
                    })
                });
                await user.save();
                await sendEmail(options);
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }
        }
    }
}

export default PaymentService;