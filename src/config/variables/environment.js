import dotenv from "dotenv";
dotenv.config();

const env = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI
};

export default env;
