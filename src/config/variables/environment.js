import dotenv from "dotenv";
dotenv.config();

const env = {
    ENV: process.env.ENV || "development",
    PORT: process.env.PORT || 3000,
    URL_PREFIX: process.env.URL_PREFIX,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    TOKEN_EXPIRE_TIME: process.env.TOKEN_EXPIRE_TIME || "10m",
    REFRESH_TOKEN_EXPIRE_TIME: process.env.REFRESH_TOKEN_EXPIRE_TIME || "7d",
    API_PREFIX: process.env.API_PREFIX || '/api/v1',
    GOOGLE_CLIENT_ID: process.env.CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.CLIENT_CALLBACK_URL,
    GOOGLE_DEFAULT_PASSWORD_FOR_NEW_USERS: process.env.GOOGLE_DEFAULT_PASSWORD_FOR_NEW_USERS,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    VN_PAY_TMN_CODE: process.env.VN_PAY_TMN_CODE,
    VN_PAY_URL: process.env.VN_PAY_URL,
    VN_PAY_HASH_SECRET: process.env.VN_PAY_HASH_SECRET,
    VN_PAY_RETURN_URL: process.env.VN_PAY_RETURN_URL,
    VN_PAY_BANK_CODE: process.env.VN_PAY_BANK_CODE,
};

export default env;
