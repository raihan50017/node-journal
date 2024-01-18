import express from 'express';
import { checkAuth } from '../../auth/auth.middleware';
import { ROLES } from '../../../helpers/constants';
import { reviewerController } from './reviewer.controller';

const router = express.Router();

// Reviewer routes
router.get(
    "/new_reviewer_invitation",
    checkAuth([ROLES.reviewer, ROLES.admin]),
    reviewerController.newReviewerInvitationPage,
  );
  
  router.get(
    "/reviewer_pending_assignments",
    checkAuth([ROLES.reviewer, ROLES.admin]),
    reviewerController.reviewerPendingAssignmentsPage,
  );

  router.post(
    "/article/:article_id",
    checkAuth([ROLES.reviewer, ROLES.admin]),
    reviewerController.updateArticleReviewer,
  );
  
  router.get(
    "/reviewer_completed_assignment",
    checkAuth([ROLES.reviewer, ROLES.admin]),
    reviewerController.reviewerCompletedAssignmentPage,
  );

export {
    router as reviewerRouter
}