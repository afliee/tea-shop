import mongoose from "mongoose";
import bcrypt from "bcrypt";

import validator from "validator";

import { Roles } from "#root/contants/roles.js";
import { ErrorMessage } from "#utils/error/message.utils.js";
import { generateRefreshToken, generateToken, verifyToken } from "#utils/jwt.utils.js";

// Validate name have not number and special character
const VALID_NAME_REGEX = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/; // example : Nguyen Van A
const TAG = "UserModel";
export const User = mongoose.model(
	"User",
	new mongoose.Schema(
		{
			name: {
				type: String,
			},
			firstName: {
				type: String,
				length: { min: 2, max: 32 },
				validate: (value) => {
					if (!validator.isAlpha(value))
						throw new Error("Invalid first name because it contains a special character");
					//     name not containst number and special character
					if (!VALID_NAME_REGEX.test(value)) throw new Error("Invalid format first name");
				},
			},
			lastName: {
				type: String,
				length: { min: 2, max: 32 },
				validate: (value) => {
					if (!validator.isAlpha(value)) throw new Error("Invalid last name");
					if (!VALID_NAME_REGEX.test(value)) throw new Error("Invalid last name");
				},
			},
			phone: {
				type: String,
				length: { min: 10, max: 10 },
				validate: (value) => {
					if (!validator.isMobilePhone(value, "vi-VN")) throw new Error("Invalid phone number");
				},
			},
			email: {
				type: String,
				required: true,
				trim: true,
				validate: (value) => {
					if (!validator.isEmail(value)) throw new Error("Invalid email address");
				},
			},
			password: {
				type: String,
				required: true,
				trim: true,
				length: { min: 8, max: 32 },
				validate: (value) => {
					if (!validator.isStrongPassword(value)) throw new Error("Invalid password");
				},
			},
			avatar: {
				type: String,
				default: "/img/default_avt.jpg",
			},
			active: {
				type: Boolean,
				default: false,
			},
			role: {
				type: String,
				enum: [...Object.keys(Roles)],
				default: Roles.USER,
			},
			token: {
				type: String,
			},
			refreshToken: {
				type: String,
			},
			googleId: {
				type: String,
			},
		},
		{
			timestamps: true,
		}
	)
);

export const verifyUser = async (user) => {
	try {
		// get user by email not select password
		let existUser = await User.findOne({
			email: user.email,
		});

		if (!existUser) {
			// status for exist user
			return ErrorMessage(400, "User not found");
		}

		if (!existUser.active) {
			return ErrorMessage(400, "Account is not active");
		}

		const isMatch = await bcrypt.compare(user.password.trim(), existUser.password.trim());
		if (!isMatch) {
			return ErrorMessage(400, "Invalid credentials");
		}

		const token = existUser.token;
		const refreshToken = existUser.refreshToken;

		const decodedToken = await verifyToken(token)
			.then((data) => data)
			.catch((e) => null);

		//     check if token is not expired then return it token or else check if refresh token is not expired then return new token
		if (decodedToken && decodedToken.exp > Date.now() / 1000) {
			console.log("token is not expired");
			return existUser;
		} else {
			console.log("token is expired");
			const decodedRefreshToken = await verifyToken(refreshToken)
				.then((data) => data)
				.catch((e) => {
					console.log(e);
					return null;
				});

			if (decodedRefreshToken && decodedRefreshToken.exp > Date.now() / 1000) {
				console.log("refresh token is not expired and generate new token");
				const newToken = await generateToken(user);
				existUser.token = newToken;
				await existUser.save();
				return existUser;
			} else {
				// generate new refresh token
				console.log("refresh token is expired");
				const newRefreshToken = await generateRefreshToken(user);
				existUser.refreshToken = newRefreshToken;

				// generate new token
				const newToken = await generateToken(user);
				existUser.token = newToken;

				await existUser.save();
				// return ErrorMessage(400, "Refresh token expired");
				return existUser;
			}
		}
	} catch (e) {
		console.log(e);
		return ErrorMessage(500, "Server error", e);
	}
};

export const findUser = async (id) => {
	try {
		const existUser = await User.findOne({
			_id: id,
		});

		if (!existUser) {
			// status for exist user
			return ErrorMessage(400, "User not found");
		}

		return existUser;
	} catch (e) {
		console.log(e);
		return ErrorMessage(500, "Server error", e);
	}
};

export const update = (id, user) => {
	return new Promise(async (resolve, reject) => {
		try {
			console.log(`[${TAG}] update`);
			const existUser = await User.findOne({
				_id: id,
			});

			if (!existUser) {
				// status for exist user
				console.log(`[${TAG}] update failed, User not found `);
				return reject(ErrorMessage(400, "User not found"));
			}

			await User.updateOne(
				{
					_id: id,
				},
				{
					$set: {
						...user,
					},
				}
			);

			await existUser.save();

			console.log(existUser);
			return resolve(existUser);
		} catch (e) {
			console.log(e);
			return reject(ErrorMessage(500, "Server error", e));
		}
	});
};

// change password
export const changePassword = (id, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(`[${TAG}] changePassword`);
            const existUser = await User.findOne({
                _id: id,
            });

            if (!existUser) {
                // status for exist user
                console.log(`[${TAG}] changePassword failed, User not found `);
                return reject(ErrorMessage(400, "User not found"));
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await User.updateOne(
				{
					_id: id,
				},
				{
					$set: {
						password: hashedPassword,
					},
				}
			);

            await existUser.save();

            console.log(existUser);
            return resolve(existUser);
        } catch (e) {
            console.log(e);
            return reject(ErrorMessage(500, "Server error", e));
        }
    });
};
