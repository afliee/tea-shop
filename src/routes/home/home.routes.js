import express from "express";
import {UserValidator} from "#validator/index.js";

const router = express.Router();


import { IndexController } from "#controllers/index.js";
import { requireToken } from "#middlewares/http/index.js";

router.get("/", IndexController.index);
router.get("/product", UserValidator.validateRememberMe, IndexController.product);
router.get("/about", UserValidator.validateRememberMe, IndexController.about);
router.get("/contact", UserValidator.validateRememberMe, IndexController.contact);
router.get('/service', UserValidator.validateRememberMe, (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    } else {
        next();
    }
}, IndexController.service);
router.post('/service', UserValidator.validateRememberMe, IndexController.createTicket);

router.get('/store', UserValidator.validateRememberMe, (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    } else {
        next();
    }
}, IndexController.store);

router.get('/store/:slug', UserValidator.validateRememberMe, (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    } else {
        next();
    }
}, IndexController.show);
export default router;