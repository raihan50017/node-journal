import { Aggregate } from "mongoose";
import { User } from "./user.model";
import { Service } from "../../common/service.common";
import { IModel } from "../../common/mongoose-schema.common";
import { IUser, IUserDoc } from "./user.interface";
import { ROLES, ROUTES } from "../../helpers/constants";
import { journalService } from "../journal";
import { ApiError } from "../../errors/ApiError";
import { mailSender } from "../../helpers/mail";
import bcryptjs from 'bcryptjs';

export class UserService extends Service<IUserDoc> {
  constructor(Model: IModel<IUserDoc>) {
    super(Model);
  }

  // create extra service here if needed..

  createUser = async (userDto: IUser, requestRole: string) => {
    const plainPassword: string = userDto.password;
    userDto.password = await bcryptjs.hash(userDto.password, 10);
    userDto.role = [requestRole];

    const journal = await journalService.findOneById({ _id: userDto.journal_id });
    if (!journal) {
      throw new ApiError(ROUTES.error.location, "journal not found");
    }

    const existingUser = await this.findOneByQuery({
      query: { email: userDto.email, journal_id: userDto.journal_id }
    });

    let user: IUserDoc;
    if (existingUser) {
      if (existingUser.role?.indexOf(requestRole) != -1) {
        throw new Error('User already exist!');
      }

      user = await this.updateById({
        _id: existingUser._id,
        updateBody: { role: [...existingUser.role, requestRole] }
      });
    } else {
      user = await this.createOne(userDto);
    }

    if (!user) {
      throw new Error('User not created');
    }

    const credetials: any = {
      journal: journal.title,
      email: user.email,
      role: requestRole
    };
    if (!existingUser) {
      credetials['password'] = plainPassword;
    }
    mailSender.sendUserCreationMail(credetials);

    return user;
  }
}

export const userService = new UserService(User);

