// routes/aiRouter.js
const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { authenticate, authorize } = require("../middleware/auth");

// All AI routes require authentication
router.use(authenticate);

// AI Chat endpoint - available to all authenticated users
router.post("/chat", aiController.chat);

// Get AI model information - available to all authenticated users
router.get("/model-info", aiController.getModelInfo);

// Get knowledge base status - admin/moderator only
router.get("/knowledge-status", authorize('admin', 'moderator'), aiController.getKnowledgeStatus);

// Reload knowledge base - admin only
router.post("/reload-knowledge", authorize('admin'), aiController.reloadKnowledge);

// Test AI connection - admin/moderator only
router.get("/test", authorize('admin', 'moderator'), aiController.testConnection);

module.exports = router;