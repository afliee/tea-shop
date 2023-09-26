import {User} from "#models/user.model.js";

class IndexController {
    constructor() {
        this.name = 'index';
    }

    async index(req, res) {
        let currentUser = null;
        // check user is logged in in passport
        if (req.session?.passport) {
            const user = req.session?.passport.user;

            if (user) {
                // find user in db and ignore password
                try {
                    currentUser = await User.findOne({
                        _id: user
                    }).select("-password");
                } catch (e) {
                    console.log(e);
                }
            }
        }

        res.render("home/index.ejs", {
            title: "Home",
            active: "home",
            currentUser
        });
    }

    async product(req, res) {
        res.render("home/product.ejs", {
            title: "Product",
        });
    }
}

export default new IndexController();