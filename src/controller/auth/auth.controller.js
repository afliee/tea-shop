import { validationResult } from "express-validator";
import { AuthService } from "#services/index.js";
import {emailUtils} from "#utils/index.js";
import { env } from "#root/config/index.js";

const { ENV, URL_PREFIX, PORT } = env;

class AuthController {
    constructor() {
    }

    async signUp( req, res ) {
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
                url: `${ URL_PREFIX }:${PORT}/auth/active/${ signUp._id }`,
                name: signUp.name || signUp.email
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
        const { id } = req.params;
        const activeAccount = await AuthService.activeAccount(id);

        if (!activeAccount) {
            return res.status(400).send({ message: "Active account failed" });
        }

        next();
    }
}

export default new AuthController();