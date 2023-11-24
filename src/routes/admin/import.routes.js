import express from "express";
import {UserValidator} from "#validator/index.js";
import {authMiddleware} from "#middlewares/http/index.js";
import {AdminImportController} from "#controllers/index.js";

const router = express.Router();

router.get('/', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    }
    next();
}, authMiddleware.requireRole(['ADMIN']), AdminImportController.index);

router.put('/approve/:id', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    }
    next();
}, authMiddleware.requireRole(['ADMIN']), AdminImportController.approved);

router.put('/reject/:id', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    }
    next();
}, authMiddleware.requireRole(['ADMIN']), AdminImportController.rejected);

export default router;