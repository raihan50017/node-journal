import { NextFunction, Request, Response } from "express";
import { IUser } from "./user.interface";
import { UserService, userService } from "./user.service";
import bcryptjs from "bcryptjs";
import { userTransformer } from "./user.transformer";
import { ApiError } from "../../errors/ApiError";
import { ROLES, ROUTES } from "../../helpers/constants";
import { authFunction } from "../auth";
import { journalService } from "../journal";
import { mailSender } from "../../helpers/mail";

class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  /**
   *
   * @objective get all users
   * @method GET
   */
  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.findAllByQuery({
        select: { password: 0, is_deleted: 0, __v: 0 },
      });

      return res.ok(users);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @objective create new editor
   * @method POST
   */
  createAuthor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.createUser(req.body, ROLES.author);

      return res.redirect(ROUTES.dashboard.path);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @objective create new editor
   * @method POST
   */
  createEditor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.createUser(req.body, ROLES.editor);

      return res.redirect(ROUTES.chiefeditorUnassignedAssignment.path);
    } catch (error) {
      next(error);
    }
  };

  /*
    * @objective create new reviewer
    * @method POST
    */
  createReviewer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.createUser(req.body, ROLES.reviewer);

      return res.redirect(ROUTES.editorInviteReviewer.path+`?article_id=${req.query.article_id}`);
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController(userService);
