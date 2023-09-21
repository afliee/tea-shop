import express from "express";
import {validationResult} from "express-validator";
import passport from "passport";

const router = express.Router();

import {AuthController} from "#controllers/index.js";

import {registerValidator, loginValidator} from "#utils/auth.utils.js";

router.get("/register", (req, res) => {
    res.render('utils/register.ejs')
})
router.post("/register", registerValidator, AuthController.signUp)

router.get("/login",(req, res) =>{
    res.send("login");
})

router.post("/register", (req, res) => {
    res.send("register");
})

export default router;