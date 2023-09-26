import {authRoutes, homeRouters} from '#routes/index.js';

import Table from 'ascii-table';

const table = new Table('Routes');


const routesConfig = (app) => {
    app.use("/", homeRouters);
    app.use("/auth", authRoutes);
//     middleware for error handling
    app.use((err, req, res, next) => {
        console.log(err);
        res.status(500).send(err.message);
    })

    const COLUMNS_NAME = ['Method', 'Path'];
    table.setHeading(...COLUMNS_NAME);

    [homeRouters, authRoutes].forEach(router => {
        router.stack.forEach(layer => {
            if (layer.route) {
                const {path, methods} = layer.route;
                Object.keys(methods).forEach(method => {
                    table.addRow(method.toUpperCase(), path);
                })
            }
        })
    })

    console.log(table.toString());
}

export default routesConfig;