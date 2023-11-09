import express from "express";
import { authMiddleware } from "#middlewares/http/index.js";
import { CategoryController } from "#controllers/index.js";
import { Roles } from "#root/contants/roles.js";
import multer from "multer";
import { multerConfig } from "#root/config/index.js";
import { CATEGORY_PATH, CATEGORY_TYPE } from "#root/config/resource/multerConfig.js";

const router = express.Router();
const upload = multer({
    storage: multerConfig(CATEGORY_PATH, CATEGORY_TYPE).storage,

})

router.get('/', authMiddleware.requireRole([Roles.ADMIN]), CategoryController.index);
router.post('/create', authMiddleware.requireRole([Roles.ADMIN]), CategoryController.add);
router.post('/update/:id', authMiddleware.requireRole([Roles.ADMIN]), CategoryController.update);
router.post('/update-image/:id', authMiddleware.requireRole([Roles.ADMIN]), upload.single('image'), CategoryController.updateImage);
export default router;