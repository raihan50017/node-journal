import Joi from "joi";
import { validationHandler } from "../../common/validation.common";

const journalSchema = Joi.object({
  title: Joi.string().required(),
  about: Joi.string().required(),
  e_issn: Joi.string().required(),
  p_issn: Joi.string().required(),
  frequency: Joi.string(),
  publication_frequency: Joi.number(),
  metrics: {
    impact_factor: Joi.number(),
    site_score: Joi.number(),
  },
  chief_editor: Joi.string().required(),
  // image: Joi.string().required(),
});

const journaleValidation = validationHandler({ body: journalSchema });

export { journaleValidation };
