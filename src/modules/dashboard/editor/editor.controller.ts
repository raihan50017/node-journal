import { NextFunction, Request, Response } from "express";
import { ROLES, ROUTES } from "../../../helpers/constants";
import { IUserDoc } from "../../users/user.interface";
import { articleService } from "../../article";
import { userService } from "../../users";
import { unselectUserFields } from "../../../common/dto.common";
import { ErrorRedirect } from "../../../errors/ApiError";
import { editorService } from "./editor.service";
import mongoose from "mongoose";

export class EditorController {

    /**
     * @objective return editorRequiredReviewCompleted page
     * @endpoint /v1/dashboard
     * @method GET
     */
    editorRequiredReviewCompletedPage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            return res.render(ROUTES.editorRequiredReviewCompleted.location);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @objective return editorRequireAdditionalReviewer page
     * @endpoint /v1/dashboard
     * @method GET
     */
    editorRequireAdditionalReviewerPage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            return res.render(ROUTES.editorRequireAdditionalReviewer.location);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @objective return editorSubmissionWithLateReviewPage page
     * @endpoint /v1/dashboard
     * @method GET
     */
    editorSubmissionWithLateReviewPage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            return res.render(ROUTES.editorSubmissionWithLateReview.location);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @objective return editorReviewerNoResponse page
     * @endpoint /v1/dashboard
     * @method GET
     */
    editorReviewerNoResponsePage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            return res.render(ROUTES.editorReviewerNoResponse.location);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @objective return editorReviewerNoResponse page
     * @endpoint /v1/dashboard
     * @method GET
     */
    editorSubmissionUnderReviewPage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            return res.render(ROUTES.editorSubmissionUnderReview.location);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @objective return editorReviewerNoResponse page
     * @endpoint /v1/dashboard
     * @method GET
     */
    editorAllAssignedSubmissionPage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            return res.render(ROUTES.editorAllAssignedSubmission.location);
        } catch (error) {
            next(error);
        }
    };

    /**
     * @objective return editorSubmissionBeingEdited page
     * @endpoint /v1/dashboard
     * @method GET
     */
    editorSubmissionBeingEditedPage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            return res.render(ROUTES.editorSubmissionBeingEdited.location);
        } catch (error) {
            next(error);
        }
    };

    /**
    * @objective return invite reviewer page
    * @endpoint /v1/dashboard
    * @method GET
    */
    inviteReviewerPage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { article_id, search } = req.query;
            if (!article_id) {
                throw new Error('article_id is required');
            }
            const authUser: IUserDoc = res.locals.user;

            const article = await articleService.findOneById({ _id: new mongoose.Types.ObjectId(String(article_id)) });
            const reviewers = await editorService.getReviewersByRole(authUser.journal_id, String(search));

            return res.render(ROUTES.editorInviteReviewer.location, {
                article: article || {},
                reviewers
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @objective return selected reviewer page
     * @endpoint /v1/dashboard
     * @method GET
     */
    selectedReviewerPage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const { article_id, selected_reviewers, submit } = req.body;
            if (!article_id || !selected_reviewers) {
                throw new Error('article_id and selected_reviewers is required');
            }

            const selectedReviewers = Array.isArray(selected_reviewers) ? selected_reviewers : [selected_reviewers];

            const article = await articleService.findOneById({ _id: new mongoose.Types.ObjectId(String(article_id)) });
            const reviewers = await userService.findAllByQuery({
                query: { _id: { $in: selectedReviewers }, journal_id: article.journal_id },
                select: unselectUserFields
            });

            if (!article || !reviewers || !reviewers.length) {
                throw new Error("reviewers not found");
            }

            if (submit) {
                const data = await editorService.finalReviewerSubmission(article, reviewers);

                return res.redirect(ROUTES.editorNewAssignment.path);
            }

            return res.render(ROUTES.editorSelectedReviewer.location, {
                article: article || {},
                reviewers
            });
        } catch (error) {
            next(error);
        }
    };


    /**
     * @objective return editorNewAssignmentPage page
     * @endpoint /v1/dashboard
     * @method GET
     */
    editorNewAssignmentPage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const authUser: IUserDoc = res.locals.user;

            const articles = await articleService.findAllByQuery({
                query: {
                    is_complete: true,
                    is_reviewer_assigned: false,
                    editors: { $elemMatch: { editor_id: authUser._id } }
                },
            });
            if (!articles?.length) {
                res.locals.error = "Ariticle not found";
            }

            return res.render(ROUTES.editorNewAssignment.location, {
                articles
            });
        } catch (error) {
            next(error);
        }
    };


    /**
     * @objective return editorNewAssignmentPage page
     * @endpoint /v1/dashboard
     * @method GET
     */
    chiefeditorUnassignedAssignmentPage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const authUser: IUserDoc = res.locals.user;

            const articles = await articleService.findAllByQuery({
                query: {
                    journal_id: authUser.journal_id,
                    is_complete: true,
                    is_reviewer_assigned: false,
                    editors: { $size: 0 }
                },
            });
            if (!articles) {
                res.locals.error = "Ariticle not found";
            }

            const editors = await userService.findAllByQuery({
                query: { journal_id: authUser.journal_id, role: { $in: [ROLES.editor, ROLES.cheifeditor] } },
                select: unselectUserFields
            });

            return res.render(ROUTES.chiefeditorUnassignedAssignment.location, {
                articles,
                editors
            });
        } catch (error) {
            next(error);
        }
    };


    assignEditor = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const authUser: IUserDoc = res.locals.user;
            if (!req.body.article_id || !req.body.editorId) {
                throw new ErrorRedirect('', 'article_id or editorId is required');
            }
            const editors = Array.isArray(req.body.editorId) ? req.body.editorId?.map((editor_id: string) => {
                return { editor_id };
            }) : [{ editor_id: req.body.editorId }];

            const article = await articleService.updateByQuery({
                query: { journal_id: authUser.journal_id, _id: req.body.article_id },
                updateBody: { editors }
            });

            return res.redirect(ROUTES.chiefeditorUnassignedAssignment.path);
        } catch (error) {
            next(error);
        }
    };

}

export const editorController = new EditorController();