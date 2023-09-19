import {verifyToken} from '#utils/jwt.utils.js';

const requireTokenMiddleware = (req, res, next) => {
//     check if token is present in the request header or exist in the cookie
    const token = req.headers?.authorization || req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized'
        });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized'
        });
    }

    req.user = decoded;

    next();
}

export default requireTokenMiddleware;