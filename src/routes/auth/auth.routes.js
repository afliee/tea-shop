import express from "express";
import {validationResult} from "express-validator";
import passport from "passport";
import bcrypt from "bcrypt";

const router = express.Router();

import {AuthController} from "#controllers/index.js";

import {registerValidator, loginValidator} from "#utils/auth.utils.js";

import {env} from "#root/config/index.js";

const {GOOGLE_DEFAULT_PASSWORD_FOR_NEW_USERS} = env;
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

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/auth",
    successRedirect: "/",
    session: true
}));

router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    });
});

router.get("/current_user", async (req, res) => {
    res.send(req.user);
})

export default router;