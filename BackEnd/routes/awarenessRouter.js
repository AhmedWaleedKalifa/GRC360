// routes/awarenessRouter.js
const express = require("express");
const awarenessController = require("../controllers/awarenessController");
const { authenticate, authorize } = require("../middleware/auth");
const awarenessRouter = express.Router();

// All awareness routes require authentication
awarenessRouter.use(authenticate);

// Training Modules - all authenticated users can read, admin/moderator can write
awarenessRouter.get("/training-modules", awarenessController.getTrainingModules);
awarenessRouter.get("/training-modules/search", awarenessController.searchTrainingModules);
awarenessRouter.get("/training-modules/:id", awarenessController.getTrainingModuleById);
awarenessRouter.post("/training-modules", authorize('admin', 'moderator'), awarenessController.createTrainingModule);
awarenessRouter.put("/training-modules/:id", authorize('admin', 'moderator'), awarenessController.updateTrainingModule);
awarenessRouter.delete("/training-modules/:id", authorize('admin', 'moderator'), awarenessController.deleteTrainingModule);

// Module Steps - all authenticated users can read, admin/moderator can write
awarenessRouter.get("/training-modules/:moduleId/steps", awarenessController.getModuleSteps);
awarenessRouter.post("/training-modules/:moduleId/steps", authorize('admin', 'moderator'), awarenessController.createStep);
awarenessRouter.put("/steps/:stepId", authorize('admin', 'moderator'), awarenessController.updateStep);
awarenessRouter.delete("/steps/:stepId", authorize('admin', 'moderator'), awarenessController.deleteStep);

// Quiz Questions - all authenticated users can read, admin/moderator can write
awarenessRouter.get("/steps/:stepId/questions", awarenessController.getQuestionsByStepId);
awarenessRouter.post("/steps/:stepId/questions", authorize('admin', 'moderator'), awarenessController.createQuestion);
awarenessRouter.put("/questions/:questionId", authorize('admin', 'moderator'), awarenessController.updateQuestion);
awarenessRouter.delete("/questions/:questionId", authorize('admin', 'moderator'), awarenessController.deleteQuestion);

// Quiz Options - all authenticated users can read, admin/moderator can write
awarenessRouter.get("/questions/:questionId/options", awarenessController.getOptionsByQuestionId);
awarenessRouter.post("/questions/:questionId/options", authorize('admin', 'moderator'), awarenessController.createOption);
awarenessRouter.put("/options/:optionId", authorize('admin', 'moderator'), awarenessController.updateOption);
awarenessRouter.delete("/options/:optionId", authorize('admin', 'moderator'), awarenessController.deleteOption);

// User Progress - users can only access their own progress
awarenessRouter.get("/users/:userId/progress", awarenessController.getUserProgress);
awarenessRouter.put("/users/:userId/progress/:moduleId", awarenessController.updateUserProgress);

// Quiz Attempts - users can only create their own attempts
awarenessRouter.post("/users/:userId/quiz-attempts/:moduleId", awarenessController.createQuizAttempt);

// Awareness Campaigns - all authenticated users can read, admin/moderator can write
awarenessRouter.get("/campaigns", awarenessController.getCampaigns);
awarenessRouter.get("/campaigns/search", awarenessController.searchCampaigns);
awarenessRouter.get("/campaigns/:id", awarenessController.getCampaignById);
awarenessRouter.post("/campaigns", authorize('admin', 'moderator'), awarenessController.createCampaign);
awarenessRouter.put("/campaigns/:id", authorize('admin', 'moderator'), awarenessController.updateCampaign);
awarenessRouter.delete("/campaigns/:id", authorize('admin', 'moderator'), awarenessController.deleteCampaign);

// Campaign Modules - all authenticated users can read, admin/moderator can write
awarenessRouter.get("/campaigns/:campaignId/modules", awarenessController.getCampaignModules);
awarenessRouter.post("/campaigns/:campaignId/modules", authorize('admin', 'moderator'), awarenessController.addCampaignModule);
awarenessRouter.delete("/campaigns/:campaignId/modules/:moduleId", authorize('admin', 'moderator'), awarenessController.removeCampaignModule);

// User Campaign Assignments - users can only access their own assignments
awarenessRouter.get("/users/:userId/campaign-assignments", awarenessController.getUserCampaignAssignments);
awarenessRouter.post("/users/:userId/campaign-assignments/:campaignId", authorize('admin', 'moderator'), awarenessController.assignUserToCampaign);
awarenessRouter.put("/user-campaign-assignments/:assignmentId", awarenessController.updateUserCampaignAssignment);

// Statistics - users can only access their own stats, admin/moderator can access all
awarenessRouter.get("/users/:userId/training-stats", awarenessController.getUserTrainingStats);
awarenessRouter.get("/campaigns/:campaignId/stats", authorize('admin', 'moderator'), awarenessController.getCampaignStats);

module.exports = awarenessRouter;