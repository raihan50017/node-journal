import express from 'express';
import { ROLES } from '../../../helpers/constants';
import { checkAuth } from '../../auth/auth.middleware';
import { editorController } from './editor.controller';
const router = express.Router();


router.get(
    "/chiefeditor-unassigned-assignments",
    checkAuth([ROLES.cheifeditor, ROLES.admin]),
    editorController.chiefeditorUnassignedAssignmentPage,
);

router.post(
    "/assign-editor",
    checkAuth([ROLES.cheifeditor, ROLES.admin]),
    editorController.assignEditor,
);

router.get(
    "/editor-new-assignments",
    checkAuth([ROLES.cheifeditor, ROLES.editor, ROLES.admin]),
    editorController.editorNewAssignmentPage,
);

router.get(
    "/editor_required_review_completed",
    checkAuth([ROLES.cheifeditor, ROLES.editor, ROLES.admin]),
    editorController.editorRequiredReviewCompletedPage,
);

router.get(
    "/editor_require_additional_reviewer",
    checkAuth([ROLES.cheifeditor, ROLES.editor, ROLES.admin]),
    editorController.editorRequireAdditionalReviewerPage,
);

router.get(
    "/editor_submission_with_late_review",
    checkAuth([ROLES.cheifeditor, ROLES.editor, ROLES.admin]),
    editorController.editorSubmissionWithLateReviewPage,
);

router.get(
    "/editor_reviewer_no_response",
    checkAuth([ROLES.cheifeditor, ROLES.editor, ROLES.admin]),
    editorController.editorReviewerNoResponsePage,
);

router.get(
    "/editor_submission_under_review",
    checkAuth([ROLES.cheifeditor, ROLES.editor, ROLES.admin]),
    editorController.editorSubmissionUnderReviewPage,
);

router.get(
    "/editor_all_assigned_submission",
    checkAuth([ROLES.cheifeditor, ROLES.editor, ROLES.admin]),
    editorController.editorAllAssignedSubmissionPage,
);

router.get(
    "/editor_submission_being_edited",
    checkAuth([ROLES.cheifeditor, ROLES.editor, ROLES.admin]),
    editorController.editorSubmissionBeingEditedPage,
);

router.get(
    "/invite_reviewer",
    checkAuth([ROLES.cheifeditor, ROLES.editor, ROLES.admin]),
    editorController.inviteReviewerPage,
);

router.post(
    "/selected_reviewer",
    checkAuth([ROLES.cheifeditor, ROLES.editor, ROLES.admin]),
    editorController.selectedReviewerPage,
);

export { router as editorRouter };
