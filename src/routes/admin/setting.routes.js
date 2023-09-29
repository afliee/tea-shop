import express from "express";

import { Roles } from "#root/contants/roles.js";

import { requireToken, authMiddleware } from "#middlewares/http/index.js";

const router = express.Router();

router.get('/team-members', requireToken, authMiddleware.requireRole([Roles.ADMIN]), ( req, res ) => {
    res.render('layouts/admin/team-members.ejs',
        {
            user: req.user
        });
});

export default router;