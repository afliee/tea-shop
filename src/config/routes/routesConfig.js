import { authRoutes} from '#routes/index.js';

const routesConfig = (app) => {
    app.use("/auth", authRoutes);
}

export default routesConfig;