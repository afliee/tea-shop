import express from "express";

const router = express.Router();

import {IndexController} from "#controllers/index.js";
import {requireToken} from "#middlewares/http/index.js";

router.get("/", IndexController.index);
router.get("/product", IndexController.product)

export default router;