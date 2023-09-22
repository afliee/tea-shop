// connect to mongodb
import mongoose from "mongoose";
import {env} from "#root/config/index.js";

const {MONGODB_URI} = env;
const connect = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        return {
            status: '✅',
            message: 'Connected to database successfully.'
        }
    } catch (e) {
        console.log(e);
        return {
            status: '❌',
            message: 'Failed to connect to database.'
        }
    }
}
export default connect;