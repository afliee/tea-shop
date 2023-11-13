import express from 'express';
import { Product } from "#models/index.js";
import { UserValidator } from "#validator/index.js";
import { ErrorMessage } from "#utils/error/message.utils.js";

import guestRoutes from "#routes/home/guest.routes.js";
const router = express.Router();


router.use('/guest', guestRoutes);
router.get('/total', ( req, res ) => {
    const products = req.cookies?.cart || [];

    const total = products.reduce(( total, product ) => {
        return total + parseInt(product.quantity);
    }, 0);
    return res.status(200).json({ total });
})
router.get('/:id', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    } else {
        next();
    }
}, ( req, res ) => {
    const id = req.params.id;
    return res.render('home/card/index.ejs', { id, user: req.user });
})



export default router;