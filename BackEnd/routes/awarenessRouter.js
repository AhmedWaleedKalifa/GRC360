// routes/awareness.js
const express = require("express");
const awarenessController = require("../controllers/awarenessController");
const awarenessRouter = express.Router();

// Training Modules
awarenessRouter.get("/training-modules", awarenessController.getTrainingModules);
awarenessRouter.get("/training-modules/search", awarenessController.searchTrainingModules);
awarenessRouter.get("/training-modules/:id", awarenessController.getTrainingModuleById);
awarenessRouter.post("/training-modules", awarenessController.createTrainingModule);
awarenessRouter.put("/training-modules/:id", awarenessController.updateTrainingModule);
awarenessRouter.delete("/training-modules/:id", awarenessController.deleteTrainingModule);

// Module Steps
awarenessRouter.get("/training-modules/:moduleId/steps", awarenessController.getModuleSteps);
awarenessRouter.post("/training-modules/:moduleId/steps", awarenessController.createStep);
awarenessRouter.put("/steps/:stepId", awarenessController.updateStep);
awarenessRouter.delete("/steps/:stepId", awarenessController.deleteStep);

// Quiz Questions - ADD THESE ROUTES
awarenessRouter.get("/steps/:stepId/questions", awarenessController.getQuestionsByStepId);
awarenessRouter.post("/steps/:stepId/questions", awarenessController.createQuestion);
awarenessRouter.put("/questions/:questionId", awarenessController.updateQuestion);
awarenessRouter.delete("/questions/:questionId", awarenessController.deleteQuestion);

// Quiz Options - ADD THESE ROUTES
awarenessRouter.get("/questions/:questionId/options", awarenessController.getOptionsByQuestionId);
awarenessRouter.post("/questions/:questionId/options", awarenessController.createOption);
awarenessRouter.put("/options/:optionId", awarenessController.updateOption);
awarenessRouter.delete("/options/:optionId", awarenessController.deleteOption);

// User Progress
awarenessRouter.get("/users/:userId/progress", awarenessController.getUserProgress);
awarenessRouter.put("/users/:userId/progress/:moduleId", awarenessController.updateUserProgress);

// Quiz Attempts
awarenessRouter.post("/users/:userId/quiz-attempts/:moduleId", awarenessController.createQuizAttempt);

// Awareness Campaigns
awarenessRouter.get("/campaigns", awarenessController.getCampaigns);
awarenessRouter.get("/campaigns/search", awarenessController.searchCampaigns);
awarenessRouter.get("/campaigns/:id", awarenessController.getCampaignById);
awarenessRouter.post("/campaigns", awarenessController.createCampaign);
awarenessRouter.put("/campaigns/:id", awarenessController.updateCampaign);
awarenessRouter.delete("/campaigns/:id", awarenessController.deleteCampaign);

// Campaign Modules
awarenessRouter.get("/campaigns/:campaignId/modules", awarenessController.getCampaignModules);
awarenessRouter.post("/campaigns/:campaignId/modules", awarenessController.addCampaignModule);
awarenessRouter.delete("/campaigns/:campaignId/modules/:moduleId", awarenessController.removeCampaignModule);

// User Campaign Assignments
awarenessRouter.get("/users/:userId/campaign-assignments", awarenessController.getUserCampaignAssignments);
awarenessRouter.post("/users/:userId/campaign-assignments/:campaignId", awarenessController.assignUserToCampaign);
awarenessRouter.put("/user-campaign-assignments/:assignmentId", awarenessController.updateUserCampaignAssignment);

// Statistics
awarenessRouter.get("/users/:userId/training-stats", awarenessController.getUserTrainingStats);
awarenessRouter.get("/campaigns/:campaignId/stats", awarenessController.getCampaignStats);

module.exports = awarenessRouter;