import express from "express";

import { requireToken, authMiddleware } from "#middlewares/http/index.js";
import { MemberController } from "#controllers/index.js";

const router = express.Router();

router.post("/", requireToken, MemberController.update, (req, res) => {
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

router.post("/change-password", requireToken, MemberController.changePassword);

export default router;
