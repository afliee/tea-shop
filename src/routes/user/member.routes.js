import express from "express";
import multer from "multer";
import { requireToken, authMiddleware } from "#middlewares/http/index.js";
import { MemberController } from "#controllers/index.js";
import {UserValidator} from "#validator/index.js";
import {User} from "#root/model/index.js";
import {ProductService} from "#services/index.js";

const router = express.Router();

const upload = multer({
	dest: "src/public/img",
});
const productService = new ProductService();
router.put('/update', upload.single("avatar"), requireToken, MemberController.updateAvatar);
router.put("/", requireToken, MemberController.update, (req, res) => {
	req.flash("type", "success");
	req.flash("message", "Update success");
	//     get url from req
	const url = req.originalUrl;
	res.redirect(url);
});

router.get("/user/profile", requireToken, (req, res) => {
	res.render("layouts/user/changePassword.ejs", {
		title: "Profile",
		user: req.user,
		flash: req.flash(),
		currentUser: req.user,
	});
});

router.get('/user/orders', async(req, res) => {
	const user = req.user;
	if (!user) {
		return res.redirect('/auth/login');
	}
	const userEntity = await User.findOne({ _id: user._id }).populate('orders');
	const orders = userEntity.orders;
	for (let i = 0; i < orders.length; i++) {
		const order = orders[i];
		console.log(order.products.length);
		const products = await productService.getAllByIds(order.products.map(p => p.product.toString()), ['name', 'price', 'images']);
		for (let j = 0; j < products.length; j++) {
			const product = products[j];
			const orderProduct = order.products.find(p => p.product.toString() === product._id.toString());
			product.quantity = orderProduct.quantity;
		}

		order['productsDetail'] = products;
		console.log(order.productsDetail);

	}

	return res.render('layouts/user/orders.ejs', {
		title: 'Orders',
		flash: req.flash(),
		currentUser: req.user,
		orders: orders
	});
})
router.post("/change-password", requireToken, MemberController.changePassword);

export default router;
