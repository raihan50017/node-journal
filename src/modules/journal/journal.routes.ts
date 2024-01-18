import express, { Router } from "express";
import { checkAuth } from "../auth/auth.middleware";
import { ROLES } from "../../helpers/constants";
import * as journalController from "./journal.controller";
import { journaleValidation } from "./journal.validation";
import { singleImageUploader } from "../../helpers/file-uploader";

const router: Router = express.Router();
const { admin, cheifeditor } = ROLES;

// journal routes
router.post("/",singleImageUploader('image'), journaleValidation, journalController.createJournal);
router.get("/", journalController.getJournals);
router.get("/:slug", journalController.getJournalDetails);

export { router as journalRouter };
