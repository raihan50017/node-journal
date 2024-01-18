import express, { Router } from "express";
import {authController} from "./auth.controller";
import { loginValidator, registrationValidator } from "./auth.validation";

const router: Router = express.Router();

router.get("/login", authController.loginPage);
router.get("/registration", authController.registrationPage);
router.post("/registration", registrationValidator, authController.registrationPost);
router.post("/login", loginValidator, authController.loginPost);
router.get("/verify/:token", authController.verifyEmail);
router.get("/logout", authController.logout);

export { router as authRouter };
