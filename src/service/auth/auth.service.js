import { User, verifyUser, findUser } from "#models/user.model.js";
import { generateRefreshToken, generateToken } from "#utils/jwt.utils.js";

import bcrypt from "bcrypt";
import { ErrorMessage } from "#utils/error/message.utils.js";


async function signIn( user ) {
    return new Promise(async ( resolve, reject ) => {
        const isOk =  verifyUser(user);
        if (!isOk) {
            return reject(isOk);
        }

        return resolve(isOk);
    })
}

async function signUp( user ) {
    try {
        const existUser = await User.findOne({
            email: user.email
        });

        if (existUser) {
            return null;
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hashSync(user?.password, salt);

        const token = await generateToken(user);
        const refreshToken = await generateRefreshToken(user);

        const newUser = new User({
            ...user,
            password: hash,
            token,
            refreshToken
        });

        await newUser.save();
        return newUser;
    } catch (e) {
        console.log(e);
        return null;
    }
}

function activeAccount( id ) {
    return new Promise(async ( resolve, reject ) => {
        const user = await findUser(id);

        if (user.status === 500 || user.status === 400) {
            return reject(user);
        }

        if (user.active) {
            return reject(ErrorMessage(400, "User already active"));
        }

        user.active = true;
        await user.save();
        return resolve(user);
    });
}

export default {
    signIn,
    signUp,
    activeAccount
}