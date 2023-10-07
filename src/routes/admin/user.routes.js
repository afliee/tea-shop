import express from "express";

import { requireToken, authMiddleware } from "#middlewares/http/index.js";
import { UserService } from "#services/index.js";
import { Roles } from "#root/contants/roles.js";
import { ErrorMessage } from "#utils/error/message.utils.js";

const router = express.Router();

router.get('/members', requireToken, authMiddleware.requireRole([Roles.ADMIN]), async ( req, res, next ) => {
    try {
        const users = await UserService.findAll({});

        if (!users) {
            return res.status(404).json(ErrorMessage(404, "Not found"));
        }

        return res.status(200).json(users);
    } catch (e) {
        console.log(e);
        return res.status(500).json(ErrorMessage(500, e.message, e))
    }
})

router.get('/members/:id', requireToken, async ( req, res, next ) => {
    try {
        const { id } = req.params;
        const user = await UserService.findUser({ id });

        if (!user) {
            return res.status(404).json(ErrorMessage(404, "Not found"));
        }

        return res.render('layouts/admin/user.ejs', {
            user: user,
            currentUser: req?.user,
            flash: req?.flash() || {}
        });
    } catch (e) {
        return res.status(500).json(ErrorMessage(500, e.message, e))
    }
})

export default router;
