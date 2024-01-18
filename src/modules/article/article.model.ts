import mongoose, { model } from "mongoose";
import { IModel, MongooseSchema } from "../../common/mongoose-schema.common";
import { IArticleDoc } from "./article.interface";

// article schema

const articleSchema = new MongooseSchema<IArticleDoc>({
  manuscript_id: {
    type: String,
    required: true,
    unique: true,
  },
  journal_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Journal'
  },
  section: {
    type: String,
    required: true,
  },
  journal_type: {
    type: String,
    required: true,
  },
  article_title: {
    type: String,
    required: true,
  },
  article_type: {
    type: String,
  },
  abstract: {
    type: String,
    required: true,
  },
  keywords: {
    type: [String],
  },
  submitted_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  authors: [
    {
      author_name: String,
      email: String,
      affiliation: String,
      corresponding: Boolean,
    },
  ],
  author_reviewers: [
    {
      reviewer_name: String,
      email: String,
      affiliation: String,
      review_status: String,
      invited_date: Date,
      agreed_date: Date,
      review_due_date: Date,
    },
  ],
  initial_submission_date: Date,
  editorial_status_date: Date,
  edit_url: {
    type: String,
    required: true,
  },
  final_reviewers: [
    {
      reviewer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      invited_date: {
        type: Date,
        default: new Date()
      },
      is_agree: {
        type: Boolean,
        default: false
      },
      is_decline: {
        type: Boolean,
        default: false
      },
      is_complete: {
        type: Boolean,
        default: false
      },
      agreed_date: Date,
      review_due_date: Date,
      review_status: String
    },
  ],
  editors: [
    {
      editor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      assigned_date: {
        type: Date,
        default: new Date()
      }
    },
  ],
  menuscript: {
    type: String,
  }, // pdf url
  cover_letter: {
    type: String,
  }, // pdf url
  article_status: {
    type: String,
  },

  target_online_publication_date: Date, // publication tasks
  target_publication_date: Date,
  target_number_of_pages: {
    type: Number,
  },
  target_volume: {
    type: Number,
  },
  target_issue: {
    type: Number,
  },
  publication_note: {
    type: String,
  },

  ratings: {
    type: Number,
  },
  final_decision: {
    type: String,
  },
  editor_decision: {
    type: Boolean,
    default: false,
  },
  is_complete: {
    type: Boolean,
    default: false,
  },
  is_under_review: {
    type: Boolean,
    default: false,
  }, // author to editor
  is_revision_needed: {
    type: Boolean,
    default: false,
  },
  is_revision_being_processed: {
    type: Boolean,
    default: false,
  },
  is_review_completed: {
    type: Boolean,
    default: false,
  },
  is_require_additional_reviewer: {
    type: Boolean,
    default: false,
  },
  is_submission_with_late_review: {
    type: Boolean,
    default: false,
  },
  is_submission_under_review: {
    type: Boolean,
    default: false,
  }, // editor to reviewer
  is_reviewer_no_response: {
    type: Boolean,
    default: false,
  },
  is_reviewer_assigned: {
    type: Boolean,
    default: false
  }
});

// create article model
const Article = model<IArticleDoc, IModel<IArticleDoc>>(
  "Article",
  articleSchema,
);

export { Article };
