import {authRoutes, homeRouters} from '#routes/index.js';

const routesConfig = (app) => {
    app.use("/", homeRouters);
    app.use("/auth", authRoutes);
}

export default routesConfig;