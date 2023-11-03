import express from "express";
import { authMiddleware } from "#middlewares/http/index.js";
import { CategoryController } from "#controllers/index.js";
import { Roles } from "#root/contants/roles.js";

const router = express.Router();

router.get('/', authMiddleware.requireRole([Roles.ADMIN]), CategoryController.index);
router.post('/create', authMiddleware.requireRole([Roles.ADMIN]), CategoryController.add);
router.post('/update/:id', authMiddleware.requireRole([Roles.ADMIN]), CategoryController.update);
export default router;