import express from "express";
import passport from "passport";
import { AuthController } from "#controllers/index.js";

import { registerValidator } from "#utils/auth.utils.js";

const router = express.Router();

router.get("/register", ( req, res ) => {
    res.render('utils/register.ejs')
})
router.post("/register", registerValidator, AuthController.signUp)

router.get("/login", ( req, res ) => {
    // log flash in req
//     check if user is logged in
    if (req.isAuthenticated()) {
        return res.redirect('/');
    } else {
        res.render('utils/login.ejs', { error: req.flash('error') || null });
    }
})

router.post("/login", (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true,
        session: true
    }, ( err, user, info ) => {
        if (err) {
            return next(err);
        }

        if (info) {
            req.flash('error', info.message);
        }
        if (!user) {
            return res.redirect('/auth/login');
        }

        req.logIn(user, function ( err ) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.post("/register", ( req, res ) => {
    res.send("register");
})

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", {
        failureRedirect: "/auth/login",
        successRedirect: "/",
        session: true
    }, ( err, user, info ) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.redirect('/auth/login');
        }

        req.logIn(user, function ( err ) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get("/logout/:id", AuthController.signOut);

router.get("/active/:id", AuthController.activeAccount, ( req, res ) => {
    res.send("Active account successfully");
});
router.get("/current_user", async ( req, res ) => {
    res.send(req.session);
})

export default router;