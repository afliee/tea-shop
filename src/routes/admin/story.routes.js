import express from "express";
import { UserValidator } from "#validator/index.js";
import { authMiddleware } from "#middlewares/http/index.js";
import { Roles } from "#root/contants/roles.js";
import { Story } from "#root/model/index.js";
import { StoryController } from "#controllers/index.js";
const router = express.Router();

router.get("/", authMiddleware.requireRole([Roles.ADMIN, Roles.POST_MANAGER]), StoryController.index);
router.get("/create", authMiddleware.requireRole([Roles.ADMIN, Roles.POST_MANAGER]), StoryController.addStory);
router.post("/create", authMiddleware.requireRole([Roles.ADMIN, Roles.POST_MANAGER]), StoryController.add);
router.put("/update/:id", authMiddleware.requireRole([Roles.ADMIN, Roles.POST_MANAGER]), StoryController.update);
router.post("/create-tag", authMiddleware.requireRole([Roles.ADMIN, Roles.POST_MANAGER]), StoryController.addTag);
router.get("/get-all-tag", authMiddleware.requireRole([Roles.ADMIN, Roles.POST_MANAGER]), StoryController.getAllTag);
router.delete("/delete/:id", authMiddleware.requireRole([Roles.ADMIN, Roles.POST_MANAGER]), StoryController.delete);
router.get("/:id", authMiddleware.requireRole([Roles.ADMIN, Roles.POST_MANAGER]), StoryController.show);
router.post("/toggle-active/:id", authMiddleware.requireRole([Roles.ADMIN], Roles.POST_MANAGER), StoryController.toggleActive);

export default router;
