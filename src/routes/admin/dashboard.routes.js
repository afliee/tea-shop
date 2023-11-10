import express from "express";
import {default as settingRoutes} from "./setting.routes.js";
import {default as userRoutes} from "./user.routes.js";
import {default as ticketRoutes} from "./ticket.routes.js";
import {default as categoryRoutes} from "./category.routes.js";
import {default as productRoutes} from "./product.routes.js";

import {default as storyRoutes} from "./story.routes.js"

import { Roles } from "#root/contants/roles.js";

import { requireToken, authMiddleware } from "#middlewares/http/index.js";

const router = express.Router();

router.get("/", requireToken, authMiddleware.requireRole([Roles.ADMIN]), ( req, res ) => {
    res.render('layouts/admin/index.ejs',
        {
            user: req.user
        });
});

router.use("/settings", settingRoutes);
router.use("/tickets", ticketRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/stories", storyRoutes);
router.use(userRoutes);

export default router;