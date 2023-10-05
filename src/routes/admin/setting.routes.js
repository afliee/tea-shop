import express from "express";

import { User } from "#models/user.model.js";
import { Roles } from "#root/contants/roles.js";

import { requireToken, authMiddleware } from "#middlewares/http/index.js";

const router = express.Router();

router.get('/team-members', requireToken, authMiddleware.requireRole([Roles.ADMIN]), async ( req, res ) => {
    const users = await User.find({}).then(( users ) => {
        return users;
    });
    res.render('layouts/admin/team-members.ejs',
        {
            user: req.user,
            users: users
        });


});

export default router;