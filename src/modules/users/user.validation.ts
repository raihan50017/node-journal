import Joi from "joi";
import { validationHandler } from "../../common/validation.common";
// user validation schema
const userSchema = Joi.object({
  journal_id: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  role: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const userValidator = validationHandler({
  body: userSchema,
});

export { userValidator };
