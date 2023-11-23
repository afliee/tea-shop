import {OrderService} from "#services/index.js";
import { OrderStatus } from "#root/contants/order.status.js";
class OrderController {
    constructor() {
        this._orderService = new OrderService();
    }

    index = async (req, res) => {
        const orders = await this._orderService.getAll();
        console.log(orders[0].orders[0]);
        return res.render('layouts/admin/orders.ejs', {
            user: req.user || null,
            orders,
            statuses: Object.values(OrderStatus)
        })
    }

    update = async (req, res) => {
        const {id} = req.params;
        const {status} = req.body;
        console.log("Update order");
        console.log(id);
        console.log(status);
        if (!Object.values(OrderStatus).includes(status)) {
            return res.status(400).json({
                message: 'Invalid status'
            })
        }

        if (!id || !status) {
            return res.status(400).json({
                message: 'Missing required fields'
            })
        }
        const order = await this._orderService.update(id, status);
        return res.status(200).json(order);
    }
}

export default new OrderController();