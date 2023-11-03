import express from 'express';
import { authMiddleware } from "#middlewares/http/index.js";
import { UserValidator } from "#validator/index.js";
import { Roles } from "#root/contants/roles.js";
import userValidator from "#validator/user/user.validator.js";
import {ImportController} from "#controllers/index.js";
import multer from "multer";
import {multerConfig} from "#root/config/index.js";
import { IMPORT_PATH, IMPORT_TYPE } from "#root/config/resource/multerConfig.js";

const router = express.Router();


router.get('/', UserValidator.validateRememberMe, ( req, res, next ) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    } else {
        next();
    }
}, authMiddleware.requireRole([Roles.ADMIN, Roles.SUPPlIER]), ( req, res ) => {
    res.render('layouts/util/import.ejs', { user: req.user });
});

const upload = multer({
    storage: multerConfig(IMPORT_PATH, IMPORT_TYPE).storage
})
router.post('/upload', upload.single('file'), ImportController.handleUpload);

export default router;