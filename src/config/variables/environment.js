import dotenv from "dotenv";
dotenv.config();

const env = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    API_PREFIX: process.env.API_PREFIX || '/api/v1',
};

export default env;
