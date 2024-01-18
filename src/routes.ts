import express, { Router } from "express";
import { userRouter } from "./modules/users";
import { authRouter } from "./modules/auth";
import { dashboardRouter } from "./modules/dashboard";
import { journalRouter } from "./modules/journal";

const routes = [
  { path: "/user", routePath: userRouter },
  { path: "/auth", routePath: authRouter },
  { path: "/dashboard", routePath: dashboardRouter },
  { path: "/journal", routePath: journalRouter },
];

const router: Router = express.Router();

for (const route of routes) {
  router.use(`/v1${route.path}`, route.routePath);
}

export { router as AllRouters };
