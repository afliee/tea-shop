import { User } from "#models/user.model.js";
import { UserValidator } from "#validator/index.js";

class IndexController {
    constructor() {
        this.name = 'index';
    }

    async index( req, res ) {
        let currentUser = null;
        // check user is logged in passport
        // if (req.session?.passport) {
        //     const user = req.session?.passport.user;
        //
        //     if (user) {
        //         // find user in db and ignore password
        //         try {
        //             currentUser = await User.findOne({
        //                 _id: user
        //             }).select("-password");
        //         } catch (e) {
        //             console.log(e);
        //         }
        //     }
        // }

        await UserValidator.validateRememberMe(req, res, ( err ) => {
            if (err) {
                console.log(err)
                return res.redirect('/auth/login');
            }

            if (req.isAuthenticated()) {
                const user = req?.user;
                console.log("req.isAuthenticated()", req.isAuthenticated())
                return res.render("home/index.ejs", {
                    title: "Home",
                    active: "home",
                    currentUser: user
                });
            } else {
                return res.redirect('/auth/login');
            }
        })
    }

    async product( req, res ) {
        res.render("home/product.ejs", {
            title: "Product",
            currentUser: req?.user || null
        });
    }

    async about( req, res ) {
        res.render("home/about.ejs", {
            title: "About",
            currentUser: req?.user || null
        });
    }

    async contact( req, res ) {
        res.render("home/contact.ejs", {
            title: "Contact",
            currentUser: req?.user || null
        });
    }

}

export default new IndexController();