import {Order} from "#root/model/index.js";
import {ProductService} from "#services/index.js";
import { ErrorMessage } from "#utils/error/message.utils.js";
import {sendEmail} from "#utils/email.utils.js";
import { OrderStatus } from "#root/contants/order.status.js";
class OrderService {
    constructor() {
        this._productService = new ProductService();
    }
    getAll = async () => {
        // get all orders sort by createdAt and group by date
        const orders = await Order.aggregate([
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    orders: {
                        $push: "$$ROOT"
                    }
                }
            }
        ]);
        for (let i = 0; i < orders.length; i++) {
            for (let j = 0; j < orders[i].orders.length; j++) {
                // console.log(orders[i].orders[j].products);
                // get all products in each order
                const order = orders[i].orders[j];
                console.log(order);
                const products = await this._productService.getAllByIds(orders[i].orders[j].products.map(item => item.product.toString()), ['name', 'price', 'slug']);
                products.forEach((item, index ) => {
                    item.quantity = order.products[index].quantity;
                })
                order.products = products
            }

        }

        return orders;
    }

    update = async (id, status) => {
        const order = await Order.findById(id);
        if (!order) {
            return ErrorMessage(500, 'Order not found');
        }
        order.status = status;
        if (status === OrderStatus.CANCELLED) {
            const products =await this._productService.getAllByIds(order.products.map(item => item.product.toString()), ['name', 'price', 'slug']);
            console.log(products);
            const options = {
                email: order.email,
                subject: 'Order cancelled',
                template: 'order-cancelled',
                context: {
                    name: order.name,
                    address : order.address,
                    amount  : order.amount,
                    products: products
                }
            }
            await sendEmail(options);
        }
        await order.save();
        return order;
    }
}

export default OrderService;