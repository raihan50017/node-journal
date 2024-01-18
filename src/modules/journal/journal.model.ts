import mongoose, { model } from "mongoose";
import { IModel, MongooseSchema } from "../../common/mongoose-schema.common";
import { IJournalDoc } from "./journal.interface";

// journal schema

const journalSchema = new MongooseSchema<IJournalDoc>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  about: {
    type: String,
    required: true,
  },
  e_issn: {
    type: String,
    required: true,
  },
  p_issn: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
  },
  publication_frequency: {
    type: Number,
  },
  metrics: {
    impact_factor: {
      type: Number,
    },
    site_score: {
      type: Number,
    },
  },
  featured_articles: [{}],
  highly_accessed: [{}],
  announcements: [{}],
  chief_editor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Journal",
    required: true,
  },
  associate_editors: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Journal",
  },
  current_issues: [{}],
  contact: {
    address: String,
    email: String,
    rules: String,
  },
  image: {
    type: String,
    required: true,
  },
});

// create journal model
const Journal = model<IJournalDoc, IModel<IJournalDoc>>(
  "Journal",
  journalSchema,
);

export { Journal };
