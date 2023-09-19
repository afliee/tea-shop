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
        console.log("Connect to mongodb successfully");
    } catch (e) {
        console.log(e);
    }
}
export default connect;