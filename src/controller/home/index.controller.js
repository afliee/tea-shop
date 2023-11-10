import { Ticket } from "#models/index.js";

import { UserValidator } from "#validator/index.js";
import {ProductService, CategoryService} from "#services/index.js";
import { ErrorMessage } from "#utils/error/message.utils.js";

const categoryService = new CategoryService();
const productService = new ProductService();
class IndexController {
    constructor() {
        this.name = 'index';

    }

    async index( req, res ) {
        let currentUser = null;

        await UserValidator.validateRememberMe(req, res, ( err ) => {
            if (err) {
                console.log(err)
                return res.redirect('/auth/login');
            }

            console.log("req.isAuthenticated()", req.isAuthenticated())
            if (req.isAuthenticated()) {
                const user = req?.user;
                return res.render("home/index.ejs", {
                    title: "Home",
                    active: "home",
                    currentUser: user
                });
            } else {
                return res.render("home/index.ejs", {
                    title: "Home",
                    active: "home",
                    currentUser: null
                });
            }
        })
    }

    async product( req, res ) {
        const categories = await categoryService.getAll();
        res.render("home/product.ejs", {
            title: "Product",
            currentUser: req?.user || null,
            categories
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

    async service(req, res ) {
        console.log("req.isAuthenticated()", req.isAuthenticated());
        res.render("home/service.ejs", {
            title: "Service",
            currentUser: req?.user || null,
            flash: req.flash() || null
        });
    }

    async createTicket( req, res ) {
        try {
            console.log("body", req.body);
            const { name, email, subject, message } = req.body;

            if (!name || !email || !subject || !message) {
                return res.status(400).json({
                    type: "danger",
                    message: "All fields are required"
                })
            }

            const ticket = {
                name,
                email,
                subject,
                message,
                status: "pending",
                createdBy: req?.user?._id
            }

            await Ticket.create(ticket);

            console.log("ticket", ticket)
            // add type and message to flash

            return res.status(201).json({
                type: "success",
                message: "Ticket created successfully"
            });
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                type: "danger",
                message: "Server error"
            });
        }
    }

    async store( req, res ) {
        const categories = await productService.getAll();
        return res.render("home/store.ejs", {
            title: "Store",
            active: "store",
            categories,
            currentUser: req?.user || null
        });
    }

     show =async (req, res) => {
        const { slug } = req.params;
        try {
            const product = await productService.getBySlug(slug);
            if (!product) {
                return res.status(404).json(ErrorMessage(404, "Product not found"));
            }
            return res.render("home/product-detail.ejs", {
                title: "Show",
                active: "store",
                product,
                currentUser: req?.user || null
            });
        } catch (e) {
            return res.status(500).json(ErrorMessage(500, "Server error"))
        }
    }
}

export default new IndexController();