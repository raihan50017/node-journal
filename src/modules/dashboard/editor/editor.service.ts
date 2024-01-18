import { Types } from "mongoose";
import { unselectUserFields } from "../../../common/dto.common";
import { ROLES } from "../../../helpers/constants";
import { userService } from "../../users";
import { IUserDoc } from "../../users/user.interface";
import { articleService } from "../../article";
import { IArticleDoc } from "../../article/article.interface";
import { journalService } from "../../journal";
import { mailSender } from "../../../helpers/mail";

export class EditorService {

    getReviewersByRole = async (journal_id: Types.ObjectId, type: string) => {
        let reviewers: IUserDoc[] = [];

        if (type === ROLES.reviewer) {
            reviewers = await userService.findAllByQuery({
                query: { journal_id, role: { $in: [ROLES.reviewer] } },
                select: unselectUserFields
            });
        } else if (type === ROLES.author) {

        }

        reviewers = JSON.parse(JSON.stringify(reviewers));
        const formattedReviewers = reviewers.map(reviewer => {
            const isEditor = reviewer.role?.find(rl => rl === ROLES.editor) ? 'Yes' : 'No';

            return { ...reviewer, isEditor };
        })

        return formattedReviewers;
    }

    finalReviewerSubmission = async (article: IArticleDoc, reviewers: IUserDoc[]) => {
        const modifiedReviewers = reviewers.map(reviewer => {
            return {
                reviewer_id: reviewer._id,
                invited_date: new Date()
            }
        });
        const updatedArticle = await articleService.updateByQuery({
            query: { _id: article._id },
            updateBody: { final_reviewers: modifiedReviewers, is_reviewer_assigned: true }
        });

        if (!updatedArticle) {
            throw new Error('submission failed');
        }
        const journal = await journalService.findOneById({ _id: updatedArticle.journal_id });

        reviewers.forEach(reviewer => {
            mailSender.sendReviewerInvitationMail(journal, updatedArticle, reviewer);
        })

        return updatedArticle;
    }
}

export const editorService = new EditorService();