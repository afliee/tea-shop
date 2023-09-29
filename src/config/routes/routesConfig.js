import { authRoutes, homeRouters, dashboardRoutes } from '#routes/index.js';

import Table from 'ascii-table';

const table = new Table('Routes');


const routesConfig = ( app ) => {
    app.use("/", homeRouters);
    app.use("/auth", authRoutes);
    app.use("/admin", dashboardRoutes);
//     middleware for error handling
    app.use(( err, req, res, next ) => {
        console.log(err);
        res.status(500).send(err.message);
    })

    const COLUMNS_NAME = ['Root Path', 'Method', 'Path'];
    table.setHeading(...COLUMNS_NAME);

    [
        { name: '/', route: homeRouters },
        { name: '/auth', route: authRoutes },
        { name: '/admin', route: dashboardRoutes }
    ].forEach(router => {
        router.route.stack.forEach(layer => {
            if (layer.route) {
                const { path, methods } = layer.route;
                Object.keys(methods).forEach(method => {
                    table.addRow(router.name, method.toUpperCase(), path);
                })
            }
        })

    //     set empty row
        table.addRow();
    })

    console.log(table.toString());
}

export default routesConfig;