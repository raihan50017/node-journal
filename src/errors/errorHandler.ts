import { NextFunction, Request, Response } from "express";
import logger from "../logger/logger";
import { ApiError, ErrorRedirect } from "./ApiError";
import { ROUTES } from "../helpers/constants";

export default class ErrorHandler {
  static errorHandler = (
    err: ApiError | ErrorRedirect,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    logger.error(err.message);

    res.locals.error = err.message;
    res.locals.stack = err.stack;
    res.locals.name = err.name;

    if (err instanceof ErrorRedirect) {
      let path = ROUTES.error.path;
      if (err.path) {
        path = err.path;
      }
      return res.redirect(`${path}?error=${err.message}`);
    }

    let location = ROUTES.error.location;
    if (err.location) {
      location = err.location;
    }

    return res.render(location);
  };
}
