import { Types } from "mongoose";
import { ICommon } from "../../common/interface.common";

interface IUser {
  journal_id: Types.ObjectId;
  name: string;
  email: string;
  role?: string[];
  designation: string;
  affiliation: string;
  password: string;
  is_email_verified: boolean;
}

interface IUserDoc extends IUser, ICommon {}

export { IUser, IUserDoc };
