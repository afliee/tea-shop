import { verifyToken } from '#utils/jwt.utils.js';
import passport from "passport";

const TAG = 'requireTokenMiddleware';

const requireTokenMiddleware = async ( req, res, next ) => {
//     require login with passport
    if (!req.user) {
        return res.redirect('/auth/login');
    }

    next();
}

export default requireTokenMiddleware;