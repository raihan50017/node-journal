import Joi from "joi";
import { validationHandler } from "../../common/validation.common";

// login validation schema
const loginSchema = Joi.object({
  journal_id: Joi.string().required(),
  email: Joi.string().email().required(),
  // role: Joi.string().valid("author", "editor", "reviewer", "admin").required(),
  author: Joi.string(),
  editor: Joi.string(),
  reviewer: Joi.string(),
  admin: Joi.string(),
  password: Joi.string().min(6).required(),
});

const registrationSchema = Joi.object({
  journal_id: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  affiliation: Joi.string().required(),
  password: Joi.string().min(6).required(),
  confirm_password: Joi.string().min(6).required(),
});

// login validation middleware
const loginValidator = validationHandler({ body: loginSchema });
const registrationValidator = validationHandler({ body: registrationSchema });

export { loginValidator, registrationValidator };
