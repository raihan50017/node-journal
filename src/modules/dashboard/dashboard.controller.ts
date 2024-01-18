import { NextFunction, Request, Response } from "express";
import { ROUTES } from "../../helpers/constants";
import { journalService } from "../journal";
import { articleService } from "../article";
import mongoose from "mongoose";
import { IUserDoc } from "../users/user.interface";
import { ApiError } from "../../errors/ApiError";
import { IAuthor, IAuthorSuggestedReviewer, IReviewer } from "../article/article.interface";

/**
 * @objective return dashboard page
 * @endpoint /v1/dashboard
 * @method GET
 */
const indexPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.render(ROUTES.dashboard.location);
    } catch (error) {
        next(error);
    }
};


/**
 * @objective return submitNewMenuscript page
 * @endpoint /v1/dashboard
 * @method GET
 */
const submitNewMenuscriptPage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { article_id } = req.query;

        if (article_id) {
            const article = await articleService.findOneByQuery({
                query: {
                    _id: new mongoose.Types.ObjectId(String(article_id)),
                    is_complete: false,
                },
            });
            if (article && !article.is_complete) {
                return res.render(ROUTES.submitNewMenuscript.location, {
                    article,
                    journals: [],
                });
            }
        }

        const journals = await journalService.findAllByQuery();
        return res.render(ROUTES.submitNewMenuscript.location, {
            article: {},
            journals,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @objective return submitNewMenuscript page
 * @endpoint /v1/dashboard
 * @method POST
 */
export const submitNewMenuscriptPost = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authUser: IUserDoc = res.locals.user;
        const menuscript_id = `JKKNIU_${new Date().getTime()}`;
        req.body.manuscript_id = menuscript_id;
        req.body.submitted_by = authUser._id;
        req.body.edit_url = ROUTES.submitMenuscriptStep2.path;
        req.body.journal_id = authUser.journal_id;

        const { article_id } = req.query;

        if (article_id) {
            const article = await articleService.upsertByQuery({
                query: { _id: article_id, is_complete: false },
                updateBody: req.body,
            });

            return res.redirect(
                `${ROUTES.submitMenuscriptStep2.path}?article_id=${article._id}`,
            );
        }

        const article = await articleService.createOne(req.body);
        return res.redirect(
            `${ROUTES.submitMenuscriptStep2.path}?article_id=${article._id}`,
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @objective return submitMenuscriptStep2 page
 * @endpoint /v1/dashboard
 * @method GET
 */
const submitMenuscriptStep2Page = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { article_id } = req.query;

        if (!article_id) {
            return res.redirect(ROUTES.submitNewMenuscript.path);
        }

        const article = await articleService.findOneByQuery({
            query: {
                _id: new mongoose.Types.ObjectId(String(article_id)),
                is_complete: false,
            },
        });
        if (!article) {
            return res.redirect(ROUTES.submitNewMenuscript.path);
        }

        return res.render(ROUTES.submitMenuscriptStep2.location, {
            article,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @objective return submitMenuscriptStep2 post
 * @endpoint /v1/dashboard
 * @method POST
 */
export const submitMenuscriptStep2Post = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { article_id } = req.query;

        if (!article_id) {
            throw new ApiError(
                ROUTES.submitNewMenuscript.location,
                "Something went wrong",
            );
        }

        const authors: IAuthor[] = [];
        for (let i = 1; i <= 5; i++) {
            const author: IAuthor = {
                author_name: req.body[`author_name${i}`],
                email: req.body[`email${i}`],
                affiliation: req.body[`affiliation${i}`],
                corresponding: false,
            };
            if (author.email && author.author_name) {
                authors.push(author);
            }
        }

        // TODO: must change
        authors[0].corresponding = true;

        const article = await articleService.updateByQuery({
            query: { _id: article_id, is_complete: false },
            updateBody: {
                authors: authors,
                edit_url: ROUTES.submitMenuscriptStep3.path,
            },
        });

        return res.redirect(
            `${ROUTES.submitMenuscriptStep3.path}?article_id=${article._id}`,
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @objective return submitMenuscriptStep3 page
 * @endpoint /v1/dashboard
 * @method GET
 */
const submitMenuscriptStep3Page = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { article_id } = req.query;

        if (!article_id) {
            return res.redirect(ROUTES.submitNewMenuscript.path);
        }

        const article = await articleService.findOneByQuery({
            query: {
                _id: new mongoose.Types.ObjectId(String(article_id)),
                is_complete: false,
            },
        });
        if (!article) {
            return res.redirect(ROUTES.submitNewMenuscript.path);
        }

        return res.render(ROUTES.submitMenuscriptStep3.location, {
            article,
        });
    } catch (error) {
        next(error);
    }
};
/**
 * @objective return submitMenuscriptStep3 page
 * @endpoint /v1/dashboard
 * @method GET
 */
export const submitMenuscriptStep3Post = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { article_id } = req.query;

        if (!article_id) {
            throw new ApiError(
                ROUTES.submitNewMenuscript.location,
                "Something went wrong",
            );
        }

        const reviewers: IAuthorSuggestedReviewer[] = [];
        for (let i = 1; i <= 3; i++) {
            const reviewer: IAuthorSuggestedReviewer = {
                reviewer_name: req.body[`reviewer_name${i}`],
                email: req.body[`email${i}`],
                affiliation: req.body[`affiliation${i}`],
            };
            if (reviewer.email && reviewer.reviewer_name) {
                reviewers.push(reviewer);
            }
        }

        const article = await articleService.updateByQuery({
            query: { _id: article_id, is_complete: false },
            updateBody: {
                author_reviewers: reviewers,
                edit_url: ROUTES.submitMenuscriptStep4.path,
            },
        });

        return res.redirect(
            `${ROUTES.submitMenuscriptStep4.path}?article_id=${article._id}`,
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @objective return submitMenuscriptStep4 page
 * @endpoint /v1/dashboard
 * @method GET
 */
const submitMenuscriptStep4Page = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { article_id } = req.query;

        if (!article_id) {
            return res.redirect(ROUTES.submitNewMenuscript.path);
        }

        const article = await articleService.findOneByQuery({
            query: {
                _id: new mongoose.Types.ObjectId(String(article_id)),
                is_complete: false,
            },
        });
        if (!article) {
            return res.redirect(ROUTES.submitNewMenuscript.path);
        }

        return res.render(ROUTES.submitMenuscriptStep4.location, {
            article,
        });
    } catch (error) {
        next(error);
    }
};
/**
 * @objective return submitMenuscriptStep4 page
 * @endpoint /v1/dashboard
 * @method GET
 */
export const submitMenuscriptStep4Post = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { article_id } = req.query;

        if (!article_id) {
            throw new ApiError(
                ROUTES.submitNewMenuscript.location,
                "Something went wrong",
            );
        }

        const reqFiles = <any>req.files;
        if (!reqFiles) {
            return res.render("validation-error", {
                error: ["File not uploaded"],
                backUrl: ROUTES.submitMenuscriptStep4.path,
            });
        }

        const menuscriptUrl = reqFiles.menuscript[0].filename;
        const coverLetterUrl = reqFiles.cover_letter[0].filename;

        const article = await articleService.updateByQuery({
            query: { _id: article_id, is_complete: false },
            updateBody: {
                menuscript: menuscriptUrl,
                cover_letter: coverLetterUrl,
                edit_url: ROUTES.submitMenuscriptStep5.path,
            },
        });

        return res.redirect(
            `${ROUTES.submitMenuscriptStep5.path}?article_id=${article._id}`,
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @objective return submitMenuscriptStep5 page
 * @endpoint /v1/dashboard
 * @method GET
 */
const submitMenuscriptStep5Page = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { article_id } = req.query;

        if (!article_id) {
            return res.redirect(ROUTES.submitNewMenuscript.path);
        }

        const article = await articleService.findOneByQuery({
            query: {
                _id: new mongoose.Types.ObjectId(String(article_id)),
                is_complete: false,
            },
        });
        if (!article) {
            return res.redirect(ROUTES.submitNewMenuscript.path);
        }

        return res.render(ROUTES.submitMenuscriptStep5.location, {
            article,
        });
    } catch (error) {
        next(error);
    }
};
/**
 * @objective return submitMenuscriptStep5 page
 * @endpoint /v1/dashboard
 * @method GET
 */
export const submitMenuscriptStep5Post = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { article_id } = req.query;

        if (!article_id) {
            throw new ApiError(
                ROUTES.submitNewMenuscript.location,
                "Something went wrong",
            );
        }

        const article = await articleService.updateByQuery({
            query: { _id: article_id, is_complete: false },
            updateBody: {
                is_complete: true,
                initial_submission_date: new Date(),
            },
        });

        return res.redirect(
            `${ROUTES.authorSubmissionUnderReview.path}?article_id=${article._id}`,
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @objective return incompleteMenuscriptPage page
 * @endpoint /v1/dashboard
 * @method GET
 */
const incompleteMenuscriptPage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authUser: IUserDoc = res.locals.user;
        const menuscripts = await articleService.findAllByQuery({
            query: { submitted_by: authUser._id, is_complete: false },
        });

        if (!menuscripts || !menuscripts.length) {
            res.locals.error = "Not found";
        }
        return res.render(ROUTES.incompleteMenuscript.location, { menuscripts });
    } catch (error) {
        next(error);
    }
};

/**
 * @objective return incompleteMenuscriptPage post
 * @endpoint /v1/dashboard
 * @method GET
 */
export const incompleteMenuscriptPost = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const action = String(req.query.action);
        if (!action) {
            throw new ApiError(ROUTES.error.location, "Action is Required");
        }

        if (action === "delete") {
            const article = await articleService.deleteById(
                new mongoose.Types.ObjectId(String(req.query.article_id)),
            );

            if (!article) {
                throw new ApiError(
                    ROUTES.error.location,
                    "Something went wrong!",
                );
            }

            return res.redirect(ROUTES.incompleteMenuscript.path);
        } else {
            throw new ApiError(
                ROUTES.error.location,
                "Something went wrong!",
            );
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @objective return authorSubmissionUnderReview page
 * @endpoint /v1/dashboard
 * @method GET
 */
const authorSubmissionUnderReviewPage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authUser: IUserDoc = res.locals.user;

        const articles = await articleService.findAllByQuery({
            query: {
                submitted_by: authUser._id,
                is_complete: true,
            },
        });
        if (!articles) {
            res.locals.error = "Ariticle not found";
        }
        return res.render(ROUTES.authorSubmissionUnderReview.location, {
            articles,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @objective return authorRevisionNeeded page
 * @endpoint /v1/dashboard
 * @method GET
 */
const authorRevisionNeededPage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authUser: IUserDoc = res.locals.user;

        const articles = await articleService.findAllByQuery({
            query: {
                submitted_by: authUser._id,
                is_revision_needed: true,
            },
        });
        if (!articles || !articles.length) {
            res.locals.error = "Not found";
        }
        return res.render(ROUTES.authorRevisionNeeded.location, {
            articles,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @objective return authorRevisionBeingProcessed page
 * @endpoint /v1/dashboard
 * @method GET
 */
const authorRevisionBeingProcessedPage = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authUser: IUserDoc = res.locals.user;

        const articles = await articleService.findAllByQuery({
            query: {
                submitted_by: authUser._id,
                is_revision_being_processed: true,
            },
        });
        if (!articles || !articles.length) {
            res.locals.error = "Not found";
        }
        return res.render(ROUTES.authorRevisionBeingProcessed.location, {
            articles,
        });
    } catch (error) {
        next(error);
    }
};



export {
    indexPage,
    submitNewMenuscriptPage,
    submitMenuscriptStep2Page,
    submitMenuscriptStep3Page,
    submitMenuscriptStep4Page,
    submitMenuscriptStep5Page,
    incompleteMenuscriptPage,
    authorSubmissionUnderReviewPage,
    authorRevisionNeededPage,
    authorRevisionBeingProcessedPage,
};
