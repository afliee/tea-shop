import passport from 'passport';

import {ExtractJwt, Strategy} from 'passport-jwt';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {User} from "#models/user.model.js";
import {Roles} from "#root/contants/roles.js";

import {env} from "#root/config/index.js";
import session from "express-session";
import bcrypt from 'bcrypt';

const {
    JWT_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    GOOGLE_DEFAULT_PASSWORD_FOR_NEW_USERS
} = env;

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

const googleStrategy = new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
}, async function (accessToken, refreshToken, profile, done) {
//     save profile to db
//     console.log(profile);

    try {
        const user = await User.findOne({email: profile.emails[0].value});
        if (user) {
            console.log("user exist");
            console.log(user)
            return done(null, user);
        } else {
            const passwordSalt =await bcrypt.genSalt(10);
            const passwordHash = bcrypt.hashSync(GOOGLE_DEFAULT_PASSWORD_FOR_NEW_USERS, passwordSalt);

            const newUser = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                role: Roles.USER,
                password: passwordHash,
                avatar: profile.photos[0].value,
                googleId: profile.id,
                active: true

            });
            await newUser.save().then((name) => {
                console.log(`User ${name} saved`);
            });
            return done(null, newUser);
        }
    } catch (e) {
        console.log(e)
        return done(e)
    }
});

export default function passportConfig(app) {
    //     config session
    app.use(session({
        secret: JWT_SECRET,
        resave: false,
        saveUninitialized: true
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            return done(null, user);
        } catch (e) {
            console.log(e)
            return done(e);
        }
    })

    passport.use(strategy);
    passport.use(googleStrategy);

    app.use(passport.initialize());
    app.use(passport.session());
    return {
        status: '✅',
        message: 'Passport config successfully'
    }
}