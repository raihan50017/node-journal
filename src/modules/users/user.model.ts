import mongoose, { model } from "mongoose";
import { IUser, IUserDoc } from "./user.interface";
import { IModel, MongooseSchema } from "../../common/mongoose-schema.common";
import { string } from "joi";
import { ROLES } from "../../helpers/constants";

// user schema

const userSchema = new MongooseSchema<IUserDoc>({
  journal_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Journal'
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: [String],
    default: [ROLES.author],
  },
  designation: String,
  affiliation: String,
  password: {
    type: String,
    required: true,
  },
  is_email_verified: {
    type: Boolean,
    default: false
  }
});

userSchema.index({email: 1, journal_id: 1});

// create user model
const User = model<IUserDoc, IModel<IUserDoc>>("User", userSchema);

export { User };
