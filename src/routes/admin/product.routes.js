import express from 'express';
import multer from 'multer';

import ProductController from "#controllers/admin/product.controller.js";

import { authMiddleware } from "#middlewares/http/index.js";
import { UserValidator } from "#validator/index.js";
import { Roles } from "#root/contants/roles.js";
import { multerConfig } from "#root/config/index.js";
import { PRODUCT_PATH, PRODUCT_TYPE } from "#root/config/resource/multerConfig.js";

const router = express.Router();
const storage = multerConfig(PRODUCT_PATH, PRODUCT_TYPE).storage;
const upload = multer({ storage: storage });
router.get('/', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/auth/login');
    }
}, ProductController.index);

router.post('/upload', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/auth/login');
    }
}, authMiddleware.requireRole([Roles.ADMIN]), upload.single('file'), ProductController.upload);

router.post('/create', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/auth/login');
    }
}, authMiddleware.requireRole([Roles.ADMIN]), ProductController.create);
export default router;