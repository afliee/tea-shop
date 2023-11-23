import express from "express";
import {UserValidator} from "#validator/index.js";
import {authMiddleware} from "#middlewares/http/index.js";
import {OrderController} from "#controllers/index.js";

const router = express.Router();

router.get('/', UserValidator.validateRememberMe, (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/auth/login');
    }
}, OrderController.index);

router.put('/:id', UserValidator.validateRememberMe, (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/auth/login');
    }
}, OrderController.update);
export  default router;