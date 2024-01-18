import express, { Router } from "express";
import {userController} from "./user.controller";
import { userValidator } from "./user.validation";
import { checkAuth } from "../auth/auth.middleware";
import { ROLES } from "../../helpers/constants";

const router: Router = express.Router();

router.get(
  "/",
  checkAuth([ROLES.author, ROLES.admin]),
  userController.getAllUsers,
);
router.post("/", userValidator, userController.createAuthor);
router.post(
  "/editor",
  checkAuth([ROLES.cheifeditor, ROLES.admin]),
  userValidator,
  userController.createEditor
);
router.post(
  "/reviewer",
  checkAuth([ROLES.cheifeditor, ROLES.editor, ROLES.admin]),
  userValidator,
  userController.createReviewer
);

export { router as userRouter };
