import passport from 'passport';
import flash from 'express-flash';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from "#models/user.model.js";
import { Roles } from "#root/contants/roles.js";

import { env } from "#root/config/index.js";
import { sendEmail } from "#utils/email.utils.js";

import { AuthService } from "#services/index.js";

import { generateToken, generateRefreshToken } from "#utils/jwt.utils.js";
import session from "express-session";
import bcrypt from 'bcrypt';

const {
    ENV,
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

const localOptions = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}

const mailOptions = {
    subject: 'Account activation',
    template: 'index',
}

const localStrategy = new LocalStrategy(localOptions, async ( req, email, password, done ) => {
    try {
        const {body} = req;

        const signIn = await AuthService.signIn(body);
        switch (signIn.status) {
            case 400: {
                return done(null, false, { message: signIn.message });
            }
            case 500: {
                if (ENV === "development") {
                    return done(null, false, { message: signIn.message, cause: signIn.cause });
                } else {
                    return done(null, false, { message: signIn.message });
                }
            }
            default: {
                return done(null, signIn);
            }
        }
    } catch (e) {
        return done(e);
    }
})

const strategy = new Strategy(jwtOptions, async ( payload, done ) => {
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
}, async function ( accessToken, refreshToken, profile, done ) {

    try {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            return done(null, user);
        } else {
            const passwordSalt = await bcrypt.genSalt(10);
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

            const token = await generateToken(newUser);
            const refreshToken = await generateRefreshToken(newUser);

            newUser.token = token;
            newUser.refreshToken = refreshToken;

            await newUser.save().then(( name ) => {
                console.log(`User ${ name } saved`);
            });

            mailOptions.email = newUser.get('email');
            mailOptions.context = {
                name: newUser.get('name'),
                email: newUser.get('email'),
                defaultPassword: GOOGLE_DEFAULT_PASSWORD_FOR_NEW_USERS
            }
            // asyncronous send mail in background
            setTimeout(() => {
                sendEmail(mailOptions);
            }, 0);

            return done(null, newUser);
        }
    } catch (e) {
        console.log(e)
        return done(e)
    }
});

export default function passportConfig( app ) {
    //     config session
    app.use(session({
        secret: JWT_SECRET,
        resave: false,
        saveUninitialized: true
    }));

    app.use(flash());

    passport.serializeUser(( user, done ) => {
        done(null, user._id);
    });

    passport.deserializeUser(async ( id, done ) => {
        try {
            const user = await User.findById(id);
            return done(null, user);
        } catch (e) {
            console.log(e)
            return done(e);
        }
    })

    passport.use(strategy);
    passport.use('local', localStrategy);
    passport.use('google', googleStrategy);

    app.use(passport.initialize());
    app.use(passport.session());
    return {
        status: '✅',
        message: 'Passport config successfully'
    }
}