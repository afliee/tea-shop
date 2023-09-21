import passport from 'passport';
import {ExtractJwt, Strategy} from 'passport-jwt';

import {User} from "#models/user.model.js";

import {env} from "#root/config/index.js";

const {JWT_SECRET} = env;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
}

const strategy = new Strategy(jwtOptions, async (payload, done) => {
    try {
        const user = await User.findOne({
            email: payload.email
        })

        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (e) {
        return done(e);
    }
});

export default function passportConfig(app) {

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            return done(null, user);
        } catch (e) {
            return done(e);
        }
    })

    passport.use(strategy);

    app.use(passport.initialize());
    console.log("passport config done");
}