import express from "express";
import {default as settingRoutes} from "./setting.routes.js";

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

export default router;