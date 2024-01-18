import { Types } from "mongoose";
import { ICommon } from "../../common/interface.common";

interface IAuthor {
  author_name: string;
  email: string;
  affiliation: string;
  corresponding: boolean;
}

interface IReviewer {
  reviewer_id: string;
  review_status?: string;
  invited_date?: Date;
  agreed_date?: Date;
  review_due_date?: Date;
}

export interface IAuthorSuggestedReviewer {
  reviewer_name: string;
  email: string;
  affiliation: string;
  review_status?: string;
  invited_date?: Date;
  agreed_date?: Date;
  review_due_date?: Date;
}

interface IEditor {
  editor_name: string;
  email: string;
  affiliation: string;
  role: string;
  corresponding: boolean;
  assigned_date: Date;
  elapsed_data: Date;
}

interface IArticle {
  manuscript_id: string;
  journal_id: Types.ObjectId;
  section: string;
  journal_type: string;
  article_title: string;
  article_type: string;
  abstract: string;
  keywords: string[];
  submitted_by: Types.ObjectId;
  authors: IAuthor[];
  author_reviewers: IAuthorSuggestedReviewer[];
  initial_submission_date: Date;
  editorial_status_date: Date;
  final_reviewers: IReviewer[];
  editors: IEditor[];
  menuscript: string; // pdf url
  cover_letter: string; // pdf url
  article_status: string;

  target_online_publication_date: Date; // publication tasks
  target_publication_date: Date;
  target_number_of_pages: number;
  target_volume: number;
  target_issue: number;
  publication_note: string;

  ratings: number;
  final_decision: string;
  editor_decision: boolean;
  edit_url: string;
  is_complete: boolean;
  is_under_review: boolean; // author to editor
  is_revision_needed: boolean;
  is_revision_being_processed: boolean;
  is_review_completed: boolean;
  is_require_additional_reviewer: boolean;
  is_submission_with_late_review: boolean;
  is_submission_under_review: boolean; // editor to reviewer
  is_reviewer_no_response: boolean;
  is_reviewer_assigned: boolean;
}

interface IArticleDoc extends IArticle, ICommon {}

export { IArticle, IArticleDoc, IAuthor, IReviewer, IEditor };
