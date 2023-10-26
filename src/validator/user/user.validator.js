import passport from "passport";

import { generateRefreshToken, generateToken, verifyToken } from "#utils/jwt.utils.js";
import { ErrorMessage } from "#utils/error/message.utils.js";
import { User } from "#models/user.model.js";

const validateRememberMe = async ( req, res, next ) => {
    try {
        const remember = req.cookies['remember'];

        if (!remember || remember === 'false') {
            return next();
        }
        console.log("remember", remember)
    //     authentication with passport jwt strategy
        await passport.authenticate('jwt', { session: false }, async ( err, user, info ) => {
            if (err) {
                console.log("err", err)
                return next(err);
            }

            if (info) {
                console.log("info", info)
                return next();
            }

            if (!user) {
                return next(
                    ErrorMessage(401, "Unauthorized", "You are not authorized to access this resource")
                );
            }
            console.log("user", user);

            req.logIn(user, async function (err) {
                if (err) {
                    return next(err);
                }

                next();
            })
        })(req, res, next);
    } catch (e) {
        console.log(e)
        return res.status(500).json(ErrorMessage(500, "Server error", e));
    }
}

export default validateRememberMe;