import express from "express";
import { default as settingRoutes } from "./setting.routes.js";
import { default as userRoutes } from "./user.routes.js";
import { default as ticketRoutes } from "./ticket.routes.js";
import { default as categoryRoutes } from "./category.routes.js";
import { default as productRoutes } from "./product.routes.js";
import { default as orderRoutes } from "../util/order.routes.js";
import { default as storyRoutes } from "./story.routes.js"
import {default as importRoutes} from "./import.routes.js";

import { Roles } from "#root/contants/roles.js";

import { requireToken, authMiddleware } from "#middlewares/http/index.js";
import { UserValidator } from "#validator/index.js";
import {Feedback} from "#root/model/index.js";
import { ErrorMessage } from "#utils/error/message.utils.js";
import {sendEmail} from "#utils/email.utils.js";
import { FeedbackStatus } from "#root/contants/feedback.status.js";

const router = express.Router();

router.get("/", requireToken, authMiddleware.requireRole([Roles.ADMIN]), ( req, res ) => {
    res.render('layouts/admin/index.ejs',
        {
            user: req.user
        });
});
router.get('/feedbacks', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/auth/login');
    }
}, authMiddleware.requireRole([Roles.ADMIN]),async ( req, res ) => {
    const feedbacks =await Feedback.find({}).populate('sender').select('-password');
    res.render('layouts/admin/feedback.ejs',
        {
            user: req.user,
            feedbacks
        });
});

router.post('/feedbacks/:id', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/auth/login');
    }
}, authMiddleware.requireRole([Roles.ADMIN]),async ( req, res ) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).json(ErrorMessage(400, 'Bad request', 'Id is required'));
    }

    try {
        const {message, email} = req.body;

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json(ErrorMessage(404, 'Not found', 'Feedback not found'));
        }

        const options = {
            email,
            subject: 'Feedback',
            template: 'feedback-reply',
            context: {
                message,
                email
            }
        }

        await sendEmail(options);
        feedback.status = FeedbackStatus.REPLIED;
        await feedback.save();

        return res.status(200).json({
            type: 'success',
            message: 'Feedback replied successfully'
        });
    } catch (e) {
        return res.status(500).json(ErrorMessage(500, 'Internal server error', e.message));
    }
});
router.use("/settings", settingRoutes);
router.use("/tickets", ticketRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/stories", storyRoutes);
router.use("/orders", orderRoutes);
router.use("/imports", importRoutes);
router.use(userRoutes);

export default router;