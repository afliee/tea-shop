import express from "express";
import { UserValidator } from "#validator/index.js";
import { authMiddleware } from "#middlewares/http/index.js";
import { Roles } from "#root/contants/roles.js";
import { Story } from "#root/model/index.js";
import { StoryController } from "#controllers/index.js";
const router = express.Router();

router.get("/", authMiddleware.requireRole([Roles.ADMIN]), StoryController.index);
router.get("/create", authMiddleware.requireRole([Roles.ADMIN]), StoryController.addStory);
router.post("/create", authMiddleware.requireRole([Roles.ADMIN]), StoryController.add);
router.put("/update/:id", authMiddleware.requireRole([Roles.ADMIN]), StoryController.update);
router.post("/create-tag", authMiddleware.requireRole([Roles.ADMIN]), StoryController.addTag);
router.get("/get-all-tag", authMiddleware.requireRole([Roles.ADMIN]), StoryController.getAllTag);
router.delete("/delete/:id", authMiddleware.requireRole([Roles.ADMIN]), StoryController.delete);
router.get("/:id", authMiddleware.requireRole([Roles.ADMIN]), StoryController.show);
router.post("/toggle-active/:id", authMiddleware.requireRole([Roles.ADMIN]), StoryController.toggleActive);

export default router;
