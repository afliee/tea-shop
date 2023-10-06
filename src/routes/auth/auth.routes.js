import express from "express";
import passport from "passport";
import { AuthController } from "#controllers/index.js";
import { UserValidator } from "#root/validator/index.js";

import { registerValidator } from "#utils/auth.utils.js";

import { env } from "#root/config/index.js";

const { REFRESH_TOKEN_EXPIRE_TIME } = env;

const router = express.Router();


router.get("/register", ( req, res ) => {
    res.render('utils/register.ejs', {
        error: req.flash('error') || null,
        message: req.flash('message') || null,
    })
})
router.post("/register", registerValidator, AuthController.signUp)


router.get('/login', UserValidator.validateRememberMe, ( req, res ) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    } else {
        res.render('utils/login.ejs', {
            flash: req.flash() || null,
        });
    }
})

router.post("/login", ( req, res, next ) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true,
        session: true
    }, ( err, user, info ) => {
        if (err) {
            return next(err);
        }

        if (info.hasOwnProperty('message')) {
            req.flash('error', info.message);
        }

        if (info.hasOwnProperty('remember')) {
            const { remember: rememberMe } = info.remember;
            if (rememberMe) {
                const token = info.remember.token;

                res.cookie('token', token, {
                    maxAge: 1000 * 60 * 24 * 7, // 7 days
                    httpOnly: true
                });

                res.cookie('remember', rememberMe, {
                    maxAge: 1000 * 60 * 24 * 7,
                    httpOnly: true
                });
            }
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

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

router.get("/google/callback", ( req, res, next ) => {
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
    res.redirect('/auth/login');
});

router.get("/reactive", ( req, res ) => {
    res.render('layouts/user/resendActiveAccount.ejs', {
        id: req.query?.id || null
    });
});

router.post("/reactive", AuthController.reactiveAccount)
router.get("/current_user", async ( req, res ) => {
    res.send(req.session);
})

export default router;