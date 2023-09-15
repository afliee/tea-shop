import express from 'express';
import resourceConfig from "./src/config/resourceConfig";

const app = express();

resourceConfig(app);

app.listen(3000, () => {

});


