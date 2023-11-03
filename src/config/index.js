import {default as env} from './variables/environment.js';
import resourceConfig from "#root/config/resource/resourceConfig.js";
import passportConfig from "#root/config/resource/passportConfig.js";
import {multerConfig} from "#root/config/resource/multerConfig.js";
import {default as routesConfig} from "./routes/routesConfig.js";
import connect from "./database/connect.js";

export {
    env,
    resourceConfig,
    routesConfig,
    passportConfig,
    multerConfig,
    connect
};
