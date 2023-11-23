import express from 'express';
import { Product, User } from "#models/index.js";
import { UserValidator } from "#validator/index.js";
import { ErrorMessage } from "#utils/error/message.utils.js";

import guestRoutes from "#routes/home/guest.routes.js";
import cartUserRoutes from "#routes/home/cart-user.routes.js";
import paymentRoutes from "#routes/home/payment.routes.js";

const router = express.Router();


router.use('/guest', guestRoutes);
router.get('/total', async ( req, res ) => {
    if (req.isAuthenticated()) {
        const id = req.user._id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: ErrorMessage(400, 'User Not Found') });
        }

        const products = user.cart || [];
        const total = products.reduce(( total, product ) => {
            return total + parseInt(product.quantity);
        }, 0);
        return res.status(200).json({ total });
    }
    const products = req.cookies?.cart || [];

    const total = products.reduce(( total, product ) => {
        return total + parseInt(product.quantity);
    }, 0);
    return res.status(200).json({ total });
})


router.use(cartUserRoutes);
router.use('/payment', paymentRoutes);


export default router;