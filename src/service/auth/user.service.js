import { User } from "#models/user.model.js";

const findUser = async (options = {}) => {
    return new Promise(async ( resolve, reject ) => {
        if (!options?.id) {
            return reject(null);
        }
        const user = await User.findOne({
            _id: options.id
        }).select("-password");

        if (!user) {
            return reject(null);
        }

        return resolve(user);
    });
}

const findAll = async ( options = {}, selection = '-password' ) => {
    return new Promise(async ( resolve, reject ) => {
        const users = await User.find(options).select(selection);

        if (!users) {
            return reject(null);
        }

        return resolve(users);
    });
}

export default {
    findUser,
    findAll
}