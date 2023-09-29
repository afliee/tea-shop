const requireRole = ( roles ) => {
    if (!roles) {
        throw new Error("Role is required");
    }

    return async ( req, res, next ) => {
        if (!Array.isArray(roles)) {
            role = [roles];
        }

        const user = req.user;
        if (!user.role.includes(roles)) {
            return res.status(403).send({
                message: "You are not authorized to access this resource"
            })
        }
        next();
    }
}

export default {
    requireRole
};