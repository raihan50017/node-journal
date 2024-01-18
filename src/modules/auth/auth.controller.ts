import { NextFunction, Request, Response } from "express";
import { userService } from "../users/user.service";
import bcryptjs from "bcryptjs";
import { ApiError, ErrorRedirect } from "../../errors/ApiError";
import { COOKIE_NAME, ROLES, ROUTES } from "../../helpers/constants";
import { IUserDoc } from "../users/user.interface";
import { journalService } from "../journal";
import { Controller } from "../../common/controller.common";
import { JournalService } from "../journal/journal.service";
import config from 'config';
import { AuthFunction, authFunction } from "./auth.function";
import { mailSender } from "../../helpers/mail";


class AuthControler extends Controller {

  constructor(
    private readonly journalService: JournalService,
    private readonly authFunction: AuthFunction,
  ) {
    super(journalService);
  }

  /**
 *
 * @objective user login page
 * @endpoint /v1/login
 * @method GET
 */
  loginPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const journals = await this.journalService.findAllByQuery();

      return res.render(ROUTES.login.location, {
        journals
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @objective user registration page
   * @endpoint /v1/auth/registration
   * @method GET
   */
  registrationPage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const journals = await this.journalService.findAllByQuery();
      return res.render(ROUTES.register.location, {
        journals
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @objective user logout
   * @endpoint /v1/logout
   * @method GET
   */
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.clearCookie(COOKIE_NAME.token).redirect(ROUTES.login.path);
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @objective user login
   * @endpoint /v1/login
   * @method POST
   */
  loginPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { journal_id, email, author, editor, reviewer, admin } = req.body;
      let role: string = "";

      if (author) {
        role = ROLES.author;
      } else if (editor) {
        role = ROLES.editor;
      } else if (reviewer) {
        role = ROLES.reviewer;
      } else if (admin) {
        role = ROLES.admin;
      }

      if (!role) {
        throw new ApiError(ROUTES.login.location, "role is required.");
      }

      let user: IUserDoc;

      if (role == ROLES.editor) {
        role = ROLES.cheifeditor;
        user = await userService.findOneByQuery({
          query: { journal_id, email, role: { $in: [ROLES.cheifeditor] } },
        });

        if (!user) {
          role = ROLES.editor;

          user = await userService.findOneByQuery({
            query: { journal_id, email, role: { $in: [ROLES.editor] } },
          });
        }
      } else {
        user = await userService.findOneByQuery({
          query: { journal_id, email, role: { $in: [role] } },
        });
      }

      if (!user) {
        res.locals.journals = await this.journalService.findAllByQuery();
        throw new ErrorRedirect(ROUTES.login.path, "User not found!");
      }

      // password comparing
      const isPasswordMatched: boolean = await bcryptjs.compare(
        req.body.password,
        user.password,
      );
      if (!isPasswordMatched) {
        throw new ErrorRedirect(ROUTES.login.path, "Incorrect Password!");
      }

      //generate toke
      const token = this.authFunction.generateJWTToken({
        _id: user._id,
        journal_id: user.journal_id,
        role: role,
      });

      return res
        .status(201)
        .cookie(COOKIE_NAME.token, "Bearer " + token, {
          expires: new Date(Date.now() + 72 * 3600000), // cookie will be removed after 72 hours
          httpOnly: true,
        })
        .redirect(301, ROUTES.dashboard.path);
    } catch (error) {
      next(error);
    }
  };

  registrationPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let role: string = ROLES.author;

      req.body.password = await bcryptjs.hash(req.body.password, 10);
      req.body.roles = [role];

      const journal = await this.journalService.findOneById({ _id: req.body.journal_id });
      if (!journal) {
        throw new ApiError(ROUTES.error.location, "journal not found");
      }

      const existingUser = await userService.findOneByQuery({
        query: { email: req.body.email, journal_id: req.body.journal_id }
      });
      if (existingUser) {
        throw new Error('User already exist!');
      }
      const user = await userService.createOne(req.body);

      //generate toke
      const token = this.authFunction.generateMailToken({
        _id: user._id,
        journal_id: user.journal_id,
        role: role,
      });

      mailSender.sendConfimationMail(user.email, journal.title, token);

      const origin = config.get<string>("server.origin");
      return res.render(ROUTES.pageWithMessage.location, {
        message: "We sent verification link to your email. Please check your inbox."
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * verify email
   * @param req 
   * @param res 
   * @param next 
   * @returns 
   */
  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //generate toke
      const mailToken = req.params.token;
      const user = this.authFunction.verifyMailToken(mailToken);

      const updatedUser = await userService.updateByQuery({
        query: { _id: user._id },
        updateBody: { is_email_verified: true }
      });

      if (!updatedUser) {
        throw new ApiError(ROUTES.error.location, "Something went wrong");
      }

      const token = this.authFunction.generateJWTToken({
        _id: updatedUser._id,
        journal_id: updatedUser.journal_id,
        role: ROLES.author
      });
      const expiresIn = config.get<number>('cookie.expiresInDays') || 2;
      return res
        .status(201)
        .cookie(COOKIE_NAME.token, "Bearer " + token, {
          expires: new Date(Date.now() + expiresIn * 24 * 3600000), // cookie will be removed after 72 hours
          httpOnly: true,
        })
        .redirect(301, ROUTES.dashboard.path);
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthControler(journalService, authFunction);
