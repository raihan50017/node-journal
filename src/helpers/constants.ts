const ROLES = {
  author: "author",
  editor: "editor",
  cheifeditor: "chiefeditor",
  reviewer: "reviewer",
  publisher: "publisher",
  admin: "admin",
};

const COOKIE_NAME = {
  token: "access_token",
};

const version = "/v1";

const ROUTES = {
  root: { path: `${version}/`, location: "index" },
  error: {
    path: `${version}/error`,
    location: "error",
  },
  login: { path: `${version}/auth/login`, location: "dashboard/login" },
  logout: { path: `${version}/auth/logout`, location: "dashboard/logout" },
  register: {
    path: `${version}/auth/registration`,
    location: "dashboard/registration",
  },
  academicJournal: {
    path: `${version}/academic-journal`,
    location: "academic-journal",
  },
  dashboard: { path: `${version}/dashboard`, location: "dashboard/index" },

  // author section
  submitNewMenuscript: {
    path: `${version}/dashboard/submit_new_menuscript`,
    location: "dashboard/submit_new_menuscript",
  },
  submitMenuscriptStep2: {
    path: `${version}/dashboard/submit_menuscript_step2`,
    location: "dashboard/submit_menuscript_step2",
  },
  submitMenuscriptStep3: {
    path: `${version}/dashboard/submit_menuscript_step3`,
    location: "dashboard/submit_menuscript_step3",
  },
  submitMenuscriptStep4: {
    path: `${version}/dashboard/submit_menuscript_step4`,
    location: "dashboard/submit_menuscript_step4",
  },
  submitMenuscriptStep5: {
    path: `${version}/dashboard/submit_menuscript_step5`,
    location: "dashboard/submit_menuscript_step5",
  },
  incompleteMenuscript: {
    path: `${version}/dashboard/incomplete_menuscript`,
    location: "dashboard/incomplete_menuscript",
  },
  authorSubmissionUnderReview: {
    path: `${version}/dashboard/author_submission_under_review`,
    location: "dashboard/author_submission_under_review",
  },
  authorRevisionNeeded: {
    path: `${version}/dashboard/author_revision_needed`,
    location: "dashboard/author_revision_needed",
  },
  authorRevisionBeingProcessed: {
    path: `${version}/dashboard/author_revision_being_processed`,
    location: "dashboard/author_revision_being_processed",
  },

  // editor section
  chiefeditorUnassignedAssignment: {
    path: `${version}/dashboard/chiefeditor-unassigned-assignments`,
    location: "dashboard/chiefeditor_unassigned_assignments",
  },
  editorNewAssignment: {
    path: `${version}/dashboard/editor-new-assignments`,
    location: "dashboard/editor_new_assignments",
  },
  editorRequiredReviewCompleted: {
    path: `${version}/dashboard/editor_required_review_completed`,
    location: "dashboard/editor_required_review_completed",
  },
  editorRequireAdditionalReviewer: {
    path: `${version}/dashboard/editor_require_additional_reviewer`,
    location: "dashboard/editor_require_additional_reviewer",
  },
  editorSubmissionWithLateReview: {
    path: `${version}/dashboard/editor_submission_with_late_review`,
    location: "dashboard/editor_submission_with_late_review",
  },
  editorReviewerNoResponse: {
    path: `${version}/dashboard/editor_reviewer_no_response`,
    location: "dashboard/editor_reviewer_no_response",
  },
  editorSubmissionUnderReview: {
    path: `${version}/dashboard/editor_submission_under_review`,
    location: "dashboard/editor_submission_under_review",
  },
  editorAllAssignedSubmission: {
    path: `${version}/dashboard/editor_all_assigned_submission`,
    location: "dashboard/editor_all_assigned_submission",
  },
  editorSubmissionBeingEdited: {
    path: `${version}/dashboard/editor_submission_being_edited`,
    location: "dashboard/editor_submission_being_edited",
  },
  editorInviteReviewer: {
    path: `${version}/dashboard/invite_reviewer`,
    location: "dashboard/invite_reviewer",
  },
  editorSelectedReviewer: {
    path: `${version}/dashboard/selected_reviewer`,
    location: "dashboard/selected_reviewer",
  },

  // reviewer section
  newReviewerInvitation: {
    path: `${version}/dashboard/new_reviewer_invitation`,
    location: "dashboard/new_reviewer_invitation",
  },
  reviewerPendingAssignments: {
    path: `${version}/dashboard/reviewer_pending_assignments`,
    location: "dashboard/reviewer_pending_assignments",
  },
  reviewerCompletedAssignment: {
    path: `${version}/dashboard/reviewer_completed_assignment`,
    location: "dashboard/reviewer_completed_assignment",
  },

  // utils
  pageWithMessage: {
    path: `${version}/with-message`,
    location: "page_with_message"
  },
  mailVerify: {
    path: `${version}/auth/verify`
  }
};

export { ROLES, ROUTES, COOKIE_NAME };
