"use strict";

/**
 * Account Settings - Account
 */

"use strict";

document.addEventListener("DOMContentLoaded", function (e) {
	(function () {
		const formChangePassword = document.querySelector("#formChangePassword");
		const btnChangePw = document.querySelector(".btn-change-pw");
		const alertChangePassword = document.querySelector("#alertChangePassword");
		const id = document.getElementById("id").value;
		const newpw = document.getElementById("newpw");
		const confirmpw = document.getElementById("confirmpw");

		btnChangePw.addEventListener("click", async function (e) {
			e.preventDefault();

			if (newpw.value !== confirmpw.value) {
				alertChangePassword.classList.add("alert-danger");
				alertChangePassword.classList.remove("d-none");
				alertChangePassword.innerHTML = "Password and confirm password not match";
				return;
			}

			// verify password: at least 8 characters, 1 uppercase letter, 1 number and 1 special character
			const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
			if (!regex.test(newpw.value)) {
				alertChangePassword.classList.remove("d-none");
				alertChangePassword.innerHTML =
					"Password must be at least 8 characters, 1 uppercase letter, 1 number and 1 special character";
				return;
			}

			try {
				await fetch(`/members/change-password`, {
					method: "POST",
					body: JSON.stringify({
						id: id,
						newpw: newpw.value,
						confirmpw: confirmpw.value,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				})
					.then((res) => {
						return res.json();
					})
					.then((res) => {
						console.log(res);
						if (res.status === 200) {
							alertChangePassword.classList.remove("alert-danger");
							alertChangePassword.classList.remove("d-none");
							alertChangePassword.classList.add("alert-success");
							alertChangePassword.innerHTML = res.message;
						} else {
							alertChangePassword.classList.remove("alert-success");
							alertChangePassword.classList.remove("d-none");
							alertChangePassword.classList.add("alert-danger");
							alertChangePassword.innerHTML = res.message;
						}
					})
					.catch((err) => {
						console.log(err);
					});
			} catch (e) {
				console.log(e);
			}
		});
	})();
});
