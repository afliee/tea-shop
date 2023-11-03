import { authRoutes, homeRouters, dashboardRoutes, memberRoutes, importRoutes } from '#routes/index.js';

import Table from 'ascii-table';
import {UserValidator} from "#validator/index.js";

const table = new Table('Routes');


const routesConfig = ( app ) => {

    app.use("/", homeRouters);
    app.use("/auth", authRoutes);
    app.use("/admin", dashboardRoutes);
    app.use("/members", memberRoutes);
    app.use("/import", importRoutes);
//     middleware for error handling
    app.get('/test', (req, res, next) => {
        res.render('test.ejs');
    })

    app.use(( err, req, res, next ) => {
        console.log(err);
        res.status(500).send(err.message);
    })
}

export default routesConfig;