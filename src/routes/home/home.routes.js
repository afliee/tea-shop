import express from "express";

const router = express.Router();

import {IndexController} from "#controllers/index.js";
import {requireToken} from "#middlewares/http/index.js";

router.get("/", IndexController.index);
router.get("/product", IndexController.product)

router.get("/about", IndexController.about)
router.get("/contact", IndexController.contact)

export default router;