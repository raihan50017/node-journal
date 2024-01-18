import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../errors/ApiError";
import { authFunction } from "./auth.function";
import { ROLES, ROUTES } from "../../helpers/constants";
import { userService } from "../users";
import mongoose from "mongoose";
import { articleService } from "../article";

/**
 * @objective Middleware for checking auth
 * @param role
 * @returns
 */
export const checkAuth = (role: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authString = req.cookies.access_token;
      if (!authString) {
        throw new ApiError(ROUTES.login.path, "Unauthorized");
      }

      const token = authString.split(" ")[1];
      const user = authFunction.verifyJWTToken(token);

      let authorized = false;
      if (Array.isArray(role) && role.length && role.includes(user.role)) {
        authorized = true;
      } else if (role === user.role) {
        authorized = true;
      }

      if (!authorized) {
        throw new ApiError(ROUTES.login.location, "unauthorized!");
      }

      // get user from database
      const userData = await userService.findOneByQuery({
        query: { _id: new mongoose.Types.ObjectId(user._id), journal_id: user.journal_id },
        select: { password: 0, is_deleted: 0, __v: 0 },
      });

      if (!userData) {
        throw new Error("user not found");
      }

      if (user.role === ROLES.author) {
        const articlesCount = await articleService.getAuthorStatistics(user._id);
        res.locals.incompleteMenuscript =
          articlesCount.incompleteMenuscript || 0;
        res.locals.completeMenuscript =
          articlesCount.completeMenuscript || 0;
        res.locals.underReview = articlesCount.underReview || 0;
        res.locals.revisionNeeded = articlesCount.revisionNeeded || 0;
        res.locals.revisionBeingProcessed =
          articlesCount.revisionBeingProcessed || 0;
      } else if(user.role === ROLES.editor || user.role === ROLES.cheifeditor) {
        const articlesCount = await articleService.getEditorStatistics(userData);
        res.locals.editorStat = articlesCount;
      } else if(user.role === ROLES.reviewer) {
        const articlesCount = await articleService.getReviewerStatistics(user._id);
        res.locals.reviewerStat = articlesCount;
      }

      res.locals.user = userData;
      res.locals.authRole = user.role;
      res.locals.roles = ROLES;
      res.locals.journal_id = user.journal_id;
      next();
    } catch (error) {
      next(error);
    }
  };
};
