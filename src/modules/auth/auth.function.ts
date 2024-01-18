import jwt from "jsonwebtoken";
import config from "config";
import { ApiError, ErrorRedirect } from "../../errors/ApiError";
import { IUser } from "../users/user.interface";
import { ROUTES } from "../../helpers/constants";
import { Types } from "mongoose";

export class AuthFunction {

  // generate jwt token
  generateJWTToken = (payload: {_id: Types.ObjectId, journal_id: Types.ObjectId, role: string}) => {
    const secret = config.get<string>("jwt.secret");
    const expiresIn = config.get<string>("jwt.accessTokenExpiresIn");

    const token = jwt.sign(payload, secret, {
      expiresIn: expiresIn,
    });

    return token;
  };


  // generate jwt token
  generateMailToken = (payload: object) => {
    const secret = config.get<string>("jwt.mailSecret");
    const expiresIn = config.get<string>("jwt.accessTokenExpiresIn");

    const token = jwt.sign(payload, secret, {
      expiresIn: expiresIn,
    });

    return token;
  };


  // verify jwt token
  verifyJWTToken = (token: string) => {
    const secret = config.get<string>("jwt.secret");

    const decoded: any = jwt.verify(token, secret);

    if (!decoded) {
      throw new ErrorRedirect(ROUTES.login.path, "unauthorized!");
    }

    return {
      _id: String(decoded._id),
      journal_id: String(decoded.journal_id),
      role: String(decoded.role),
    };
  };

  // verify jwt token
  verifyMailToken = (token: string) => {
    const secret = config.get<string>("jwt.mailSecret");

    const decoded: any = jwt.verify(token, secret);

    if (!decoded) {
      throw new ApiError(ROUTES.login.location, "unauthorized!");
    }

    return {
      _id: String(decoded._id),
      journal_id: String(decoded.journal_id),
      role: String(decoded.role),
    };
  };
}

export const authFunction = new AuthFunction();
