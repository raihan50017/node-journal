import { NextFunction, Request, Response } from "express";
import { ROUTES } from "../../../helpers/constants";
import { IUserDoc } from "../../users/user.interface";
import { articleService } from "../../article";

class ReviewerController {

    /**
     * @objective return newReviewerInvitation page
     * @endpoint /v1/dashboard
     * @method GET
     */
    newReviewerInvitationPage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const authUser: IUserDoc = res.locals.user;

            const articles = await articleService.findAllByQuery({
                query: {
                    is_complete: true,
                    final_reviewers: {
                        $elemMatch: {
                            reviewer_id: authUser._id,
                            is_agree: false,
                            is_decline: false,
                        }
                    }
                },
            });
            if (!articles?.length) {
                res.locals.error = "Ariticle not found";
            }

            return res.render(ROUTES.newReviewerInvitation.location, {
                articles
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @objective return reviewerPendingAssignments page
     * @endpoint /v1/dashboard
     * @method GET
     */
    reviewerPendingAssignmentsPage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const authUser: IUserDoc = res.locals.user;

            const articles = await articleService.findAllByQuery({
                query: {
                    is_complete: true,
                    final_reviewers: {
                        $elemMatch: {
                            reviewer_id: authUser._id,
                            is_agree: true,
                        }
                    }
                },
            });
            if (!articles?.length) {
                res.locals.error = "Ariticle not found";
            }

            return res.render(ROUTES.reviewerPendingAssignments.location, {
                articles
            });
        } catch (error) {
            next(error);
        }
    };

    updateArticleReviewer = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const updateBody: any = {};
            const query: any = { _id: req.params.article_id };

            Object.keys(req.body).forEach(key => {
                query[`final_reviewers.${key}`] = !(req.body[key] == 1);
                updateBody[`final_reviewers.$.${key}`] = (req.body[key] == 1);
            });

            const article = await articleService.updateByQuery({
                query: query,
                updateBody: updateBody
            });

            return res.redirect(ROUTES.newReviewerInvitation.path);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @objective return reviewerCompletedAssignment page
     * @endpoint /v1/dashboard
     * @method GET
     */
    reviewerCompletedAssignmentPage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            return res.render(ROUTES.reviewerCompletedAssignment.location);
        } catch (error) {
            next(error);
        }
    };
}

export const reviewerController = new ReviewerController();