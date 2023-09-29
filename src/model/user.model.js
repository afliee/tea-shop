import mongoose from "mongoose";
import bcrypt from "bcrypt";

import validator from 'validator';

import { Roles } from "#root/contants/roles.js";
import { ErrorMessage } from "#utils/error/message.utils.js";
import { generateRefreshToken, generateToken, verifyToken } from "#utils/jwt.utils.js";

export const User = mongoose.model(
    'User',
    new mongoose.Schema({
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            validate: ( value ) => {
                if (!validator.isEmail(value)) throw new Error('Invalid email address');
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            length: { min: 8, max: 32 },
            validate: ( value ) => {
                if (!validator.isStrongPassword(value)) throw new Error('Invalid password');
            }
        },
        avatar: {
            type: String,
            default: "/img/default_avt.jpg"
        },
        active: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: [...Object.keys(Roles)],
            default: Roles.USER
        },
        token: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
        googleId: {
            type: String
        }
    }, {
        timestamps: true
    })
)

export const verifyUser = async ( user ) => {
    try {
        // get user by email not select password
        let existUser = await User.findOne({
            email: user.email
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

        const decodedToken = await verifyToken(token).then(( data ) => data).catch(( e ) => null);

        //     check if token is not expired then return it token or else check if refresh token is not expired then return new token
        if (decodedToken && decodedToken.exp > Date.now() / 1000) {
            console.log("token is not expired");
            return existUser;
        } else {
            console.log("token is expired");
            const decodedRefreshToken = await verifyToken(refreshToken);
            if (!decodedRefreshToken) {
                return ErrorMessage(400, "Invalid refresh token");
            }

            if (decodedRefreshToken.exp > Date.now() / 1000) {
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
                return ErrorMessage(400, "Refresh token expired");
            }
        }
    } catch (e) {
        console.log(e);
        return ErrorMessage(500, "Server error", e);
    }
}

export const findUser = async ( id ) => {
    try {
        const existUser = await User.findOne({
            _id: id
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
}