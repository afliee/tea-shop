import jwt from "jsonwebtoken";
import { env } from "#root/config/index.js";

const { JWT_SECRET, TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME } = env;
const ONE_DAY = 60 * 60 * 24;
const generateToken = ( user ) => {
    return new Promise( ( resolve, reject ) => {
        const payload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        jwt.sign( payload, JWT_SECRET, {
            expiresIn: TOKEN_EXPIRE_TIME,
            algorithm: "HS256",
        }, ( err, token ) => {
            if (err) {
                return reject( err );
            }

            return resolve( token );
        } );
    } )
}

const generateRefreshToken = ( user ) => {
    return new Promise( ( resolve, reject ) => {
        const payload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        jwt.sign( payload, JWT_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
            algorithm: "HS256",
        }, ( err, token ) => {
            if (err) {
                return reject( err );
            }

            return resolve( token );
        } );
    } )
}

const verifyToken = ( token ) => {
    return new Promise( ( resolve, reject ) => {
        jwt.verify( token, JWT_SECRET, ( err, decoded ) => {
            if (err) {
                return reject( err );
            }

            return resolve( decoded );
        } );
    } )
}


export { generateToken, generateRefreshToken, verifyToken };