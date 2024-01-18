import { Service } from "../../common/service.common";
import { IModel } from "../../common/mongoose-schema.common";
import { IArticleDoc } from "./article.interface";
import { Article } from "./article.model";
import mongoose, { Model, Types } from "mongoose";
import { IUser, IUserDoc } from "../users/user.interface";

class ArticleService extends Service<IArticleDoc>{

  constructor(private articleModel: IModel<IArticleDoc>) {
    super(articleModel);
  }

  // create extra service here if needed..
  getAuthorStatistics = async (userId: string) => {
    // const incompleteMenuscript = await this.articleModel.find({ submitted_by: userId, is_complete: false }).count().notDeleted();
    // const completeMenuscript = await this.articleModel.find({ submitted_by: userId, is_complete: true }).count().notDeleted();
    // const underReview = await this.articleModel.find({ submitted_by: userId, is_under_review: true }).count().notDeleted();
    // const revisionNeeded = await this.articleModel.find({ submitted_by: userId, is_revision_needed: true }).count().notDeleted();
    // const revisionBeingProcessed = await this.articleModel.find({ submitted_by: userId, is_revision_being_processed: true }).count().notDeleted();

    const userMongoId = new mongoose.Types.ObjectId(userId);
    const data = await this.articleModel.aggregate([
      {
        $match: {
          submitted_by: userMongoId
        }
      },
      {
        $facet: {
          incompleteMenuscript: [
            { $match: { is_complete: false, is_deleted: false } },
            { $count: "incompleteMenuscript" },
          ],
          completeMenuscript: [
            { $match: { is_complete: true, is_deleted: false } },
            { $count: "completeMenuscript" },
          ],
          underReview: [
            { $match: { is_under_review: true, is_deleted: false } },
            { $count: "underReview" },
          ],
          revisionNeeded: [
            { $match: { is_revision_needed: true, is_deleted: false } },
            { $count: "revisionNeeded" },
          ],
          revisionBeingProcessed: [
            {
              $match: { is_revision_being_processed: true, is_deleted: false },
            },
            { $count: "revisionBeingProcessed" },
          ],
        }
      }
    ]);
    const stat = data?.[0];
    return {
      incompleteMenuscript: stat?.incompleteMenuscript?.[0]?.incompleteMenuscript || 0,
      completeMenuscript: stat?.completeMenuscript?.[0]?.completeMenuscript || 0,
      underReview: stat?.underReview?.[0]?.underReview || 0,
      revisionNeeded: stat?.revisionNeeded?.[0]?.revisionNeeded || 0,
      revisionBeingProcessed: stat?.revisionBeingProcessed?.[0]?.revisionBeingProcessed || 0,
    };
  };

  // create extra service here if needed..
  getEditorStatistics = async (user: IUserDoc) => {
    const newSubmission = await this.articleModel.find({
      journal_id: user.journal_id,
      is_complete: true,
      is_reviewer_assigned: false,
      editors: { $elemMatch: { editor_id: user._id } }
    }).count().notDeleted();

    const unAssignedSubmission = await this.articleModel.find({
      journal_id: user.journal_id,
      is_complete: true,
      is_reviewer_assigned: false,
      editors: { $size: 0 }
    }).count().notDeleted();

    return {
      newSubmission,
      unAssignedSubmission
    };

  }

  getReviewerStatistics = async (userId: string) => {

    const userMongoId = new mongoose.Types.ObjectId(userId);
    const data = await this.articleModel.aggregate([
      {
        $match: {
          is_complete: true,
          final_reviewers: { $elemMatch: { reviewer_id: userMongoId } }
        }
      },
      {
        $facet: {
          newInvitation: [
            { $match: { final_reviewers: { $elemMatch: { is_agree: false, is_decline: false } } } },
            { $count: "newInvitation" },
          ],
          pendingAssignment: [
            { $match: { final_reviewers: { $elemMatch: { is_agree: true } } } },
            { $count: "pendingAssignment" },
          ],
          completedAssignment: [
            { $match: { final_reviewers: { $elemMatch: { is_agree: true, is_complete: true } } } },
            { $count: "completedAssignment" },
          ],
        }
      }
    ]);
    const stat = data?.[0];
    return {
      newInvitation: stat?.newInvitation?.[0]?.newInvitation || 0,
      pendingAssignment: stat?.pendingAssignment?.[0]?.pendingAssignment || 0,
      completedAssignment: stat?.completedAssignment?.[0]?.completedAssignment || 0,
    };
  };
}

export const articleService = new ArticleService(Article);

