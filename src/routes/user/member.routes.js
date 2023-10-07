import express from "express";

import {requireToken, authMiddleware} from "#middlewares/http/index.js";
import { MemberController } from "#controllers/index.js";

const router = express.Router();

router.post("/", requireToken, MemberController.update, ( req, res ) => {
    req.flash("type", "success");
    req.flash("message", "Update success");
//     get url from req
    const url = req.originalUrl;
    res.redirect(url);
});

export default router;
