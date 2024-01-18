import Joi from "joi";
import { validationHandler } from "../../common/validation.common";

const articleSchema1 = Joi.object({
  // journal_id: Joi.string().required(),
  section: Joi.string().required(),
  journal_type: Joi.string().required(),
  article_title: Joi.string().required(),
  abstract: Joi.string().required(),
  keywords: Joi.string().required(),
  authors: Joi.array().items(Joi.object({})),
  // author_reviewers: IReviewer[];
  menuscript: Joi.string(), // pdf url
  cover_letter: Joi.string(), // pdf url
  article_status: Joi.string(),
});

const articleSchema2 = Joi.object({
  author_name1: Joi.string().required(),
  email1: Joi.string().required(),
  affiliation1: Joi.string().required(),

  author_name2: Joi.string().allow(""),
  email2: Joi.string().allow(""),
  affiliation2: Joi.string().allow(""),

  author_name3: Joi.string().allow(""),
  email3: Joi.string().allow(""),
  affiliation3: Joi.string().allow(""),

  author_name4: Joi.string().allow(""),
  email4: Joi.string().allow(""),
  affiliation4: Joi.string().allow(""),

  author_name5: Joi.string().allow(""),
  email5: Joi.string().allow(""),
  affiliation5: Joi.string().allow(""),
});

const articleSchema3 = Joi.object({
  reviewer_name1: Joi.string().required(),
  email1: Joi.string().required(),
  affiliation1: Joi.string().required(),

  reviewer_name2: Joi.string().required(),
  email2: Joi.string().required(),
  affiliation2: Joi.string().required(),

  reviewer_name3: Joi.string().required(),
  email3: Joi.string().required(),
  affiliation3: Joi.string().required(),
});

const articleValidator1 = validationHandler({ body: articleSchema1 });
const articleValidator2 = validationHandler({ body: articleSchema2 });
const articleValidator3 = validationHandler({ body: articleSchema3 });

export { articleValidator1, articleValidator2, articleValidator3 };
