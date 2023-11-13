// this file is import all routes and export them
import {default as authRoutes } from "./auth/auth.routes.js";
import {default as homeRouters} from "./home/home.routes.js";
import {default as dashboardRoutes} from "./admin/dashboard.routes.js";
import {default as memberRoutes} from "./user/member.routes.js";
import {default as importRoutes} from "./util/import.routes.js";
import {default as categoryRoutes} from "./admin/category.routes.js";
import cartRoutes from "#routes/home/cart.routes.js";

export {
    homeRouters,
    authRoutes,
    dashboardRoutes,
    memberRoutes,
    importRoutes,
    categoryRoutes,
    cartRoutes
}
