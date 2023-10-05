import express from "express";
import {UserValidator} from "#validator/index.js";

const router = express.Router();


import { IndexController } from "#controllers/index.js";
import { requireToken } from "#middlewares/http/index.js";

router.get("/", IndexController.index);
router.get("/product", UserValidator.validateRememberMe, IndexController.product);
router.get("/about", UserValidator.validateRememberMe, IndexController.about)
router.get("/contact", UserValidator.validateRememberMe, IndexController.contact)

export default router;