import express from 'express';

import {
    env,
    resourceConfig,
    routesConfig,
    passportConfig,
    connect
} from "./src/config/index.js";

const {PORT} = env;

// init express instance
const app = express();

// passport config
passportConfig(app);

// config resources
resourceConfig(app);

// config routes
routesConfig(app);



// connect to database
await connect();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});