import express from "express";

const router = express.Router();

import {requireToken} from "#middlewares/http/index.js";

router.get("/register", (req, res) =>{
    res.send("register");
})

export default router;