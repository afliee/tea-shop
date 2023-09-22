import dotenv from "dotenv";
dotenv.config();

const env = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    API_PREFIX: process.env.API_PREFIX || '/api/v1',
    GOOGLE_CLIENT_ID: process.env.CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.CLIENT_CALLBACK_URL,
    GOOGLE_DEFAULT_PASSWORD_FOR_NEW_USERS: process.env.GOOGLE_DEFAULT_PASSWORD_FOR_NEW_USERS,
};

export default env;
