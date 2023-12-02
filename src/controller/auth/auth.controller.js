import { validationResult } from "express-validator";
import { AuthService } from "#services/index.js";
import { emailUtils, jwtUtils } from "#utils/index.js";
import { env } from "#root/config/index.js";
import {findUser, User} from "#models/user.model.js";

const { ENV, URL_PREFIX, PORT } = env;

const TAG = "AuthController";

class AuthController {
    constructor() {
    }

    async signUp( req, res ) {
        console.log(`[${ TAG }] signUp`)

        const errorAfterValidation = validationResult(req);
        if (!errorAfterValidation.isEmpty()) {
            return res.status(400).send({ errors: errorAfterValidation.mapped() });
        }
        // this.authService undefined
        const { body } = req;
        const signUp = await AuthService.signUp(body);

        if (!signUp) {
            return res.status(400).send({ message: "User already exists" });
        }

        req.session.users = req.session.users || [];
        req.session.users.push({
            _id: signUp._id,
            email: signUp.email,
            token: signUp.token,
            refreshToken: signUp.refreshToken
        });

        req.session.save();

        await emailUtils.sendEmail({
            email: signUp.email,
            subject: "Active account",
            template: "activeAccount",
            context: {
                url: `${ URL_PREFIX }/auth/active/${ signUp._id }?success_url=${ URL_PREFIX }/auth/login&failure_url=${ URL_PREFIX }/auth/reactive?id=${ signUp._id }&token=${ signUp.token }`,
                name: signUp.name || signUp.email,
            }
        })

        return res.status(201).send(signUp);
    }

    async signIn( req, res ) {
        console.log(req)

        const { body } = req;
        const signIn = await AuthService.signIn(body);

        switch (signIn.status) {
            case 400: {
                return res.status(400).send({ message: signIn.message });
            }
            case 500: {
                if (ENV === "development") {
                    return res.status(500).send({ message: signIn.message, cause: signIn.cause });
                }

                return res.status(500).send({ message: signIn.message });
            }
            default: {
                req.session.users = req.session?.users || [];
                //     check if user already exist in session
                const user = req.session.users.find(user => user._id === signIn._id);
                if (!user) {
                    req.session.users.push({
                        _id: signIn._id,
                        email: signIn.email,
                        token: signIn.token,
                        refreshToken: signIn.refreshToken
                    });
                } else {
                    user.token = signIn.token;
                    user.refreshToken = signIn.refreshToken;
                }

                req.session.save();

                return res.status(200).send(signIn);
            }
        }
    }

    async signOut( req, res ) {
        console.log(`[${ TAG }] signOut`)

        const { id } = req.params;
        if (!req.session.users) {
            req.session.users = [];
        }
        req.session.users = req.session.users.filter(user => user._id !== id);
        req.session.save();

        req.logout(( err ) => {
            if (err) {
                return res.status(500).send({ message: "Sign out failed" });
            }
        });

        res.clearCookie('token');
        res.clearCookie('remember');

        return res.status(200).send({
            message: "Sign out successfully",
            redirect: "/"
        });
    }

    async activeAccount( req, res, next ) {
        console.log(`[${ TAG }] activeAccount`)

        const { id } = req.params;
        const { success_url, failure_url, token } = req.query;
        try {
            const decoded = await jwtUtils.verifyToken(token).catch(err => null);

            console.log(decoded)
            if (!decoded) {
                return res.redirect(failure_url)
            }

            if (decoded.exp < Date.now() / 1000) {
                return res.redirect(`/auth/reactive?email=${ decoded.email }`);
            }

            const activeAccount = await AuthService.activeAccount(id);

            if (!activeAccount) {
                return res.status(400).send({ message: "Active account failed" });
            }

            req.flash('message', 'Active account successfully')
            return res.redirect(success_url);
        } catch (e) {
            console.log(e);
            req.flash('error', e.message)
            return res.redirect(failure_url)
        }
    }

    async reactiveAccount( req, res, next ) {
        console.log(`[${ TAG }] reactiveAccount`)

        try {
            const { id } = req.body;

            const user = await findUser(id);
            const token =await jwtUtils.generateToken(user);

            await emailUtils.sendEmail({
                email: user.email,
                subject: "Reactivate account",
                template: "activeAccount",
                context: {
                    url: `${ URL_PREFIX }/auth/active/${ user._id }?success_url=${ URL_PREFIX }/auth/login&failure_url=${ URL_PREFIX }/auth/reactive?id=${ user._id }&token=${ token }`,
                    name: user.name || user.email,
                }
            }).then(() => {
                req.flash('message', 'New active account link has been sent to your email')
                return res.redirect('/auth/login')
            })


        } catch (e) {
            console.log(e);

        }
    }

    async sendMailForgotPassword( req, res, next ) {
        console.log(`[${ TAG }] sendMailForgotPassword`)

        try {
            const {email} = req.body;
            const user = await User.findOne({email: email});
            const token = await jwtUtils.generateToken(user);

            await emailUtils.sendEmail({
                email: user.email,
                subject: "Forgot password",
                template: "forgotPassword",
                context: {
                    url: `${URL_PREFIX}/auth/forgot-password/${user._id}`,
                    name: user.name || user.email,
                }
            }).then(() => {
                req.flash('message', 'New forgot password link has been sent to your email')
                res.redirect('/auth/login')
            })
        } catch (e) {
            console.log(e);
            req.flash('error', e.message)
        }
    }

    async forgotPassword( req, res, next ) {
        console.log(`[${ TAG }] forgotPassword`)
        try {
            const data = {
                id: req.body.id,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
            }
            const user = await AuthService.forgotPassword(data);
            if (user != null) {
                return res.status(200).send({message: "Password reset successfully"})
            } else {
                return res.status(400).send({message: "Password reset failed"})
            }
        } catch (e) {
            console.log(e)
            return res.status(500).send({message: "Server error"})
        }
    }
}

export default new AuthController();