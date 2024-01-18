import { NextFunction, Request, Response } from "express";
import { ROUTES } from "./constants";

const setLocals = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.locals.assets = "/static/uploads/";
    res.locals.error = "";
    res.locals.message = "";
    res.locals.success = "";
    res.locals.title = "Journal";
    res.locals.description = "";
    res.locals.route = req.path;
    res.locals.cookieFound = false;
    res.locals.url = req.url;
    res.locals.ROUTES = ROUTES;

    const authString = req.cookies.access_token;
    if (authString) {
      res.locals.cookieFound = true;
    }

    if(req.query.error) {
      res.locals.error = req.query.error;
    }

    if(req.query.message) {
      res.locals.message = req.query.message;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { setLocals };
