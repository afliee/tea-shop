import express from 'express';

import Table from 'ascii-table';

const table = new Table('App Configuration');
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
const passwordConfigStatus = passportConfig(app);

// config resources
const resourceConfigStatus = resourceConfig(app);

// config routes
routesConfig(app);

// connect to database
const dbConnectStatus = await connect();

const COLUMNS_NAME = ['Status', 'Message'];
table.setHeading(...COLUMNS_NAME);
table.addRow(passwordConfigStatus.status, passwordConfigStatus.message);
table.addRow(resourceConfigStatus.status, resourceConfigStatus.message);
table.addRow(dbConnectStatus.status, dbConnectStatus.message);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    console.log(table.toString());
});