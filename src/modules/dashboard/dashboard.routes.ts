import express, { Router } from "express";
import * as dashboardController from "./dashboard.controller";
import { checkAuth } from "../auth/auth.middleware";
import { ROLES } from "../../helpers/constants";
import {
  articleValidator1,
  articleValidator2,
  articleValidator3,
} from "../article/article.validation";
import { multiplePDFUploader } from "../../helpers/file-uploader";
import { editorRouter } from "./editor/editor.routes";
import { reviewerRouter } from "./reviewer/reviewer.routes";

const router: Router = express.Router();

router.use(editorRouter);
router.use(reviewerRouter);

router.get(
  "/",
  checkAuth([ROLES.author, ROLES.cheifeditor, ROLES.editor, ROLES.reviewer, ROLES.admin]),
  dashboardController.indexPage,
);

// Authors Section

router.get(
  "/submit_new_menuscript",
  checkAuth([ROLES.author, ROLES.admin]),
  dashboardController.submitNewMenuscriptPage,
);
router.post(
  "/submit_new_menuscript",
  checkAuth([ROLES.author, ROLES.admin]),
  articleValidator1,
  dashboardController.submitNewMenuscriptPost,
);

router.get(
  "/submit_menuscript_step2",
  checkAuth([ROLES.author, ROLES.admin]),
  dashboardController.submitMenuscriptStep2Page,
);
router.post(
  "/submit_menuscript_step2",
  checkAuth([ROLES.author, ROLES.admin]),
  articleValidator2,
  dashboardController.submitMenuscriptStep2Post,
);

router.get(
  "/submit_menuscript_step3",
  checkAuth([ROLES.author, ROLES.admin]),
  dashboardController.submitMenuscriptStep3Page,
);
router.post(
  "/submit_menuscript_step3",
  checkAuth([ROLES.author, ROLES.admin]),
  articleValidator3,
  dashboardController.submitMenuscriptStep3Post,
);

router.get(
  "/submit_menuscript_step4",
  checkAuth([ROLES.author, ROLES.admin]),
  dashboardController.submitMenuscriptStep4Page,
);
router.post(
  "/submit_menuscript_step4",
  checkAuth([ROLES.author, ROLES.admin]),
  multiplePDFUploader(["menuscript", "cover_letter"]),
  dashboardController.submitMenuscriptStep4Post,
);

router.get(
  "/submit_menuscript_step5",
  checkAuth([ROLES.author, ROLES.admin]),
  dashboardController.submitMenuscriptStep5Page,
);
router.post(
  "/submit_menuscript_step5",
  checkAuth([ROLES.author, ROLES.admin]),
  dashboardController.submitMenuscriptStep5Post,
);

router.get(
  "/incomplete_menuscript",
  checkAuth([ROLES.author, ROLES.admin]),
  dashboardController.incompleteMenuscriptPage,
);
router.post(
  "/incomplete_menuscript",
  checkAuth([ROLES.author, ROLES.admin]),
  dashboardController.incompleteMenuscriptPost,
);

router.get(
  "/author_submission_under_review",
  checkAuth([ROLES.author, ROLES.admin]),
  dashboardController.authorSubmissionUnderReviewPage,
);

router.get(
  "/author_revision_needed",
  checkAuth([ROLES.author, ROLES.admin]),
  dashboardController.authorRevisionNeededPage,
);

router.get(
  "/author_revision_being_processed",
  checkAuth([ROLES.author, ROLES.admin]),
  dashboardController.authorRevisionBeingProcessedPage,
);

// Editors section


export { router as dashboardRouter };
