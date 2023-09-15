import express from 'express';

import resourceConfig from "./src/config/resourceConfig.js";
import {env} from "./src/config/variables/index.js";

const app = express();

resourceConfig(app);

app.listen(3000, () => {
    console.log(`Server is running on port ${env.PORT}`);
});


