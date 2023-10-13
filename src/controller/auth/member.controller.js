import { ErrorMessage } from "#utils/error/message.utils.js";
import { User, update, changePassword } from "#models/user.model.js";

const TAG = "MemberController";

class MemberController {
    constructor() {
    }

    async update( req, res, next ) {
        console.log(`[${ TAG }] update`)

        try {

            const { id, name, firstName, lastName, phone, address, avatar } = req.body;

            console.log(`[${ TAG }] update`, id, name, firstName, lastName, phone, address, avatar);
            const user = await update(id, {
                name,
                firstName,
                lastName,
                phone,
                address,
                avatar
            })

            if (!user) {
                req.flash("type", "danger");
                req.flash("message", "Update failed");
                return res.status(400).json(ErrorMessage(400, {
                    status: 400,
                    message: "Update failed",
                    url: req.originalUrl
                }))
            }

            req.flash("type", "success");
            req.flash("message", "Update success");
            return res.status(200).json({
                status: 200,
                message: "Update success",
                url: req.originalUrl
            });
        } catch (e) {
            return res.status(500).json(ErrorMessage(500, e.message, e))
        }
    }

    async changePassword( req, res, next ) {
        console.log(`[${ TAG }] changePassword`)

        try {
            const {id, newpw, confirmpw} = req.body;

            console.log(`[${ TAG }] changePassword`, id, newpw, confirmpw);
            const user = await changePassword(id, newpw);

            if (!user) {
                req.flash("type", "danger");
                req.flash("message", "Update failed");
                return res.status(400).json(ErrorMessage(400, {
                    status: 400,
                    message: "Change password failed",
                    url: req.originalUrl
                }))
            }

            req.flash("type", "success");
            req.flash("message", "Update success");
            return res.status(200).json({
                status: 200,
                message: "Change password success",
                url: req.originalUrl
            });

        } catch (e) {
            return res.status(500).json(ErrorMessage(500, e.message, e));
        }
    }   
}

export default new MemberController();