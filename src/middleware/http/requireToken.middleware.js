import {verifyToken} from '#utils/jwt.utils.js';

const requireTokenMiddleware = async (req, res, next) => {
//     require token in session
    const token = req.session.token;

    if (!token) {
        return res.status(401).send("Unauthorized");
    }

    try {
        const decoded = await verifyToken(token);

        req.user = decoded;

        next();
    } catch (e) {
        return res.status(401).send("Unauthorized");
    }

}

export default requireTokenMiddleware;