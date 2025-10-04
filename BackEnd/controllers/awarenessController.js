// controllers/awarenessController.js
const db = require("../db/queries/awareness");
const { ConflictError, BadRequestError, NotFoundError } = require("../errors/errors");
const { logAction } = require("./auditHelper");

// Training Modules
async function getTrainingModules(req, res, next) {
  try {
    const modules = await db.getAllTrainingModules();
    res.status(200).json(modules);
  } catch (err) {
    next(err);
  }
}

async function getTrainingModuleById(req, res, next) {
  try {
    const { id } = req.params;
    const module = await db.getTrainingModuleById(parseInt(id));

    if (!module) {
      throw new NotFoundError("Training module not found");
    }

    // Get steps with questions and options
    const steps = await db.getStepsByModuleId(parseInt(id));
    for (let step of steps) {
      if (step.step_type === 'quiz') {
        step.questions = await db.getQuestionsByStepId(step.step_id);
        for (let question of step.questions) {
          question.options = await db.getOptionsByQuestionId(question.question_id);
        }
      }
    }
    
    module.steps = steps;
    res.status(200).json(module);
  } catch (err) {
    next(err);
  }
}

async function createTrainingModule(req, res, next) {
  try {
    const { title, description, duration, category, video_url, importance, status, sort_order } = req.body;

    if (!title || !category) {
      throw new BadRequestError("Title and category are required");
    }

    const newModule = await db.addTrainingModule({
      title,
      description,
      duration,
      category,
      video_url,
      importance,
      status,
      sort_order
    });

    await logAction(req, "CREATE", "training_module", newModule.module_id, {
      title,
      category
    });

    res.status(201).json(newModule);
  } catch (err) {
    next(err);
  }
}

async function updateTrainingModule(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const updatedModule = await db.updateTrainingModule(parseInt(id), fields);

    if (!updatedModule) {
      throw new NotFoundError("Training module not found");
    }

    await logAction(req, "UPDATE", "training_module", parseInt(id), {
      changed_fields: Object.keys(fields)
    });

    res.status(200).json(updatedModule);
  } catch (err) {
    next(err);
  }
}

async function deleteTrainingModule(req, res, next) {
  try {
    const { id } = req.params;
    const deletedModule = await db.removeTrainingModule(parseInt(id));

    if (!deletedModule) {
      throw new NotFoundError("Training module not found");
    }

    await logAction(req, "DELETE", "training_module", parseInt(id), {
      title: deletedModule.title
    });

    res.status(200).json({ message: "Training module deleted successfully", module: deletedModule });
  } catch (err) {
    next(err);
  }
}

async function searchTrainingModules(req, res, next) {
  try {
    const { q } = req.query;

    if (!q) {
      throw new BadRequestError("Search query is required");
    }
    
    const searchQuery = q.trim();
    if (searchQuery.length === 0) {
      throw new BadRequestError("Search query cannot be empty");
    }

    const modules = await db.searchTrainingModules(searchQuery);
    res.status(200).json(modules);
  } catch (err) {
    next(err);
  }
}

// Steps
async function getModuleSteps(req, res, next) {
  try {
    const { moduleId } = req.params;
    const steps = await db.getStepsByModuleId(parseInt(moduleId));
    res.status(200).json(steps);
  } catch (err) {
    next(err);
  }
}

async function createStep(req, res, next) {
  try {
    const { moduleId } = req.params;
    const { step_type, title, content, duration, sort_order } = req.body;

    if (!step_type || !title) {
      throw new BadRequestError("Step type and title are required");
    }

    const newStep = await db.addStep({
      module_id: parseInt(moduleId),
      step_type,
      title,
      content,
      duration,
      sort_order
    });

    await logAction(req, "CREATE", "training_step", newStep.step_id, {
      title,
      step_type
    });

    res.status(201).json(newStep);
  } catch (err) {
    next(err);
  }
}

async function updateStep(req, res, next) {
  try {
    const { stepId } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const updatedStep = await db.updateStep(parseInt(stepId), fields);

    if (!updatedStep) {
      throw new NotFoundError("Step not found");
    }

    await logAction(req, "UPDATE", "training_step", parseInt(stepId), {
      changed_fields: Object.keys(fields)
    });

    res.status(200).json(updatedStep);
  } catch (err) {
    next(err);
  }
}

async function deleteStep(req, res, next) {
  try {
    const { stepId } = req.params;
    const deletedStep = await db.removeStep(parseInt(stepId));

    if (!deletedStep) {
      throw new NotFoundError("Step not found");
    }

    await logAction(req, "DELETE", "training_step", parseInt(stepId), {
      title: deletedStep.title
    });

    res.status(200).json({ message: "Step deleted successfully", step: deletedStep });
  } catch (err) {
    next(err);
  }
}

// Questions
async function getQuestionsByStepId(req, res, next) {
  try {
    const { stepId } = req.params;
    const questions = await db.getQuestionsByStepId(parseInt(stepId));
    
    // Get options for each question
    for (let question of questions) {
      question.options = await db.getOptionsByQuestionId(question.question_id);
    }
    
    res.status(200).json(questions);
  } catch (err) {
    next(err);
  }
}

async function createQuestion(req, res, next) {
  try {
    const { stepId } = req.params;
    const { question_text, question_type, correct_answer, explanation, sort_order, options } = req.body;

    if (!question_text || correct_answer === undefined) {
      throw new BadRequestError("Question text and correct answer are required");
    }

    const newQuestion = await db.addQuestion({
      step_id: parseInt(stepId),
      question_text,
      question_type,
      correct_answer,
      explanation,
      sort_order
    });

    // Add options if provided
    if (options && options.length > 0) {
      for (let option of options) {
        await db.addOption({
          question_id: newQuestion.question_id,
          option_text: option.option_text,
          option_order: option.option_order
        });
      }
    }

    // Get the complete question with options
    const completeQuestion = await db.getQuestionById(newQuestion.question_id);
    completeQuestion.options = await db.getOptionsByQuestionId(newQuestion.question_id);

    await logAction(req, "CREATE", "quiz_question", newQuestion.question_id, {
      step_id: stepId
    });

    res.status(201).json(completeQuestion);
  } catch (err) {
    next(err);
  }
}

async function updateQuestion(req, res, next) {
  try {
    const { questionId } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const updatedQuestion = await db.updateQuestion(parseInt(questionId), fields);

    if (!updatedQuestion) {
      throw new NotFoundError("Question not found");
    }

    await logAction(req, "UPDATE", "quiz_question", parseInt(questionId), {
      changed_fields: Object.keys(fields)
    });

    res.status(200).json(updatedQuestion);
  } catch (err) {
    next(err);
  }
}

async function deleteQuestion(req, res, next) {
  try {
    const { questionId } = req.params;
    const deletedQuestion = await db.removeQuestion(parseInt(questionId));

    if (!deletedQuestion) {
      throw new NotFoundError("Question not found");
    }

    await logAction(req, "DELETE", "quiz_question", parseInt(questionId), {
      question_text: deletedQuestion.question_text
    });

    res.status(200).json({ message: "Question deleted successfully", question: deletedQuestion });
  } catch (err) {
    next(err);
  }
}

// Options
async function getOptionsByQuestionId(req, res, next) {
  try {
    const { questionId } = req.params;
    const options = await db.getOptionsByQuestionId(parseInt(questionId));
    res.status(200).json(options);
  } catch (err) {
    next(err);
  }
}

async function createOption(req, res, next) {
  try {
    const { questionId } = req.params;
    const { option_text, option_order } = req.body;

    if (!option_text || option_order === undefined) {
      throw new BadRequestError("Option text and order are required");
    }

    const newOption = await db.addOption({
      question_id: parseInt(questionId),
      option_text,
      option_order
    });

    await logAction(req, "CREATE", "quiz_option", newOption.option_id, {
      question_id: questionId
    });

    res.status(201).json(newOption);
  } catch (err) {
    next(err);
  }
}

async function updateOption(req, res, next) {
  try {
    const { optionId } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const updatedOption = await db.updateOption(parseInt(optionId), fields);

    if (!updatedOption) {
      throw new NotFoundError("Option not found");
    }

    await logAction(req, "UPDATE", "quiz_option", parseInt(optionId), {
      changed_fields: Object.keys(fields)
    });

    res.status(200).json(updatedOption);
  } catch (err) {
    next(err);
  }
}

async function deleteOption(req, res, next) {
  try {
    const { optionId } = req.params;
    const deletedOption = await db.removeOption(parseInt(optionId));

    if (!deletedOption) {
      throw new NotFoundError("Option not found");
    }

    await logAction(req, "DELETE", "quiz_option", parseInt(optionId), {
      option_text: deletedOption.option_text
    });

    res.status(200).json({ message: "Option deleted successfully", option: deletedOption });
  } catch (err) {
    next(err);
  }
}

// User Progress
async function getUserProgress(req, res, next) {
  try {
    const { userId } = req.params;
    const progress = await db.getUserAllProgress(parseInt(userId));
    res.status(200).json(progress);
  } catch (err) {
    next(err);
  }
}

async function updateUserProgress(req, res, next) {
  try {
    const { userId, moduleId } = req.params;
    const { status, progress_percentage, score, time_spent } = req.body;

    const progress = await db.updateUserProgress({
      user_id: parseInt(userId),
      module_id: parseInt(moduleId),
      status,
      progress_percentage,
      score,
      time_spent
    });

    await logAction(req, "UPDATE", "user_training_progress", progress.progress_id, {
      module_id: moduleId,
      status,
      progress_percentage,
      score
    });

    res.status(200).json(progress);
  } catch (err) {
    next(err);
  }
}

// Quiz Attempts
async function createQuizAttempt(req, res, next) {
  try {
    const { userId, moduleId } = req.params;
    const { score, time_spent, total_questions, correct_answers, answers } = req.body;

    const attempt = await db.createQuizAttempt({
      user_id: parseInt(userId),
      module_id: parseInt(moduleId),
      score,
      time_spent,
      total_questions,
      correct_answers
    });

    if (answers && answers.length > 0) {
      await db.saveQuestionAnswers(attempt.attempt_id, answers);
    }

    // Update user progress
    const status = score >= 70 ? 'completed' : 'in_progress';
    await db.updateUserProgress({
      user_id: parseInt(userId),
      module_id: parseInt(moduleId),
      status,
      progress_percentage: 100,
      score,
      time_spent
    });

    await logAction(req, "CREATE", "quiz_attempt", attempt.attempt_id, {
      module_id: moduleId,
      score,
      passed: attempt.passed
    });

    res.status(201).json(attempt);
  } catch (err) {
    next(err);
  }
}

// Awareness Campaigns
async function getCampaigns(req, res, next) {
  try {
    const campaigns = await db.getAllCampaigns();
    res.status(200).json(campaigns);
  } catch (err) {
    next(err);
  }
}

async function getCampaignById(req, res, next) {
  try {
    const { id } = req.params;
    const campaign = await db.getCampaignById(parseInt(id));

    if (!campaign) {
      throw new NotFoundError("Campaign not found");
    }

    // Get campaign modules
    campaign.modules = await db.getCampaignModules(parseInt(id));
    res.status(200).json(campaign);
  } catch (err) {
    next(err);
  }
}

async function createCampaign(req, res, next) {
  try {
    const { title, description, status, start_date, end_date, target_audience, created_by } = req.body;

    if (!title || !start_date || !end_date) {
      throw new BadRequestError("Title, start date, and end date are required");
    }

    const newCampaign = await db.addCampaign({
      title,
      description,
      status,
      start_date,
      end_date,
      target_audience,
      created_by
    });

    await logAction(req, "CREATE", "awareness_campaign", newCampaign.campaign_id, {
      title,
      status
    });

    res.status(201).json(newCampaign);
  } catch (err) {
    next(err);
  }
}

async function updateCampaign(req, res, next) {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const updatedCampaign = await db.updateCampaign(parseInt(id), fields);

    if (!updatedCampaign) {
      throw new NotFoundError("Campaign not found");
    }

    await logAction(req, "UPDATE", "awareness_campaign", parseInt(id), {
      changed_fields: Object.keys(fields)
    });

    res.status(200).json(updatedCampaign);
  } catch (err) {
    next(err);
  }
}

async function deleteCampaign(req, res, next) {
  try {
    const { id } = req.params;
    const deletedCampaign = await db.removeCampaign(parseInt(id));

    if (!deletedCampaign) {
      throw new NotFoundError("Campaign not found");
    }

    await logAction(req, "DELETE", "awareness_campaign", parseInt(id), {
      title: deletedCampaign.title
    });

    res.status(200).json({ message: "Campaign deleted successfully", campaign: deletedCampaign });
  } catch (err) {
    next(err);
  }
}

async function searchCampaigns(req, res, next) {
  try {
    const { q } = req.query;

    if (!q) {
      throw new BadRequestError("Search query is required");
    }

    const campaigns = await db.searchCampaigns(q.trim());
    res.status(200).json(campaigns);
  } catch (err) {
    next(err);
  }
}

// Campaign Modules
async function getCampaignModules(req, res, next) {
  try {
    const { campaignId } = req.params;
    const modules = await db.getCampaignModules(parseInt(campaignId));
    res.status(200).json(modules);
  } catch (err) {
    next(err);
  }
}

async function addCampaignModule(req, res, next) {
  try {
    const { campaignId } = req.params;
    const { module_id, sort_order, assigned_date, due_date } = req.body;

    const campaignModule = await db.addCampaignModule({
      campaign_id: parseInt(campaignId),
      module_id,
      sort_order,
      assigned_date,
      due_date
    });

    res.status(201).json(campaignModule);
  } catch (err) {
    next(err);
  }
}

async function removeCampaignModule(req, res, next) {
  try {
    const { campaignId, moduleId } = req.params;
    const deletedModule = await db.removeCampaignModule(parseInt(campaignId), parseInt(moduleId));

    if (!deletedModule) {
      throw new NotFoundError("Campaign module not found");
    }

    res.status(200).json({ message: "Campaign module removed successfully", module: deletedModule });
  } catch (err) {
    next(err);
  }
}

// User Campaign Assignments
async function getUserCampaignAssignments(req, res, next) {
  try {
    const { userId } = req.params;
    const assignments = await db.getUserCampaignAssignments(parseInt(userId));
    res.status(200).json(assignments);
  } catch (err) {
    next(err);
  }
}

async function assignUserToCampaign(req, res, next) {
  try {
    const { userId, campaignId } = req.params;
    
    const assignment = await db.assignUserToCampaign({
      user_id: parseInt(userId),
      campaign_id: parseInt(campaignId)
    });

    await logAction(req, "CREATE", "user_campaign_assignment", assignment.assignment_id, {
      user_id: userId,
      campaign_id: campaignId
    });

    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
}

async function updateUserCampaignAssignment(req, res, next) {
  try {
    const { assignmentId } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      throw new BadRequestError("No fields to update");
    }

    const updatedAssignment = await db.updateUserCampaignAssignment(parseInt(assignmentId), fields);

    if (!updatedAssignment) {
      throw new NotFoundError("Assignment not found");
    }

    await logAction(req, "UPDATE", "user_campaign_assignment", parseInt(assignmentId), {
      changed_fields: Object.keys(fields)
    });

    res.status(200).json(updatedAssignment);
  } catch (err) {
    next(err);
  }
}

// Statistics
async function getUserTrainingStats(req, res, next) {
  try {
    const { userId } = req.params;
    const stats = await db.getUserTrainingStats(parseInt(userId));
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

async function getCampaignStats(req, res, next) {
  try {
    const { campaignId } = req.params;
    const stats = await db.getCampaignStats(parseInt(campaignId));
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  // Training Modules
  getTrainingModules,
  getTrainingModuleById,
  createTrainingModule,
  updateTrainingModule,
  deleteTrainingModule,
  searchTrainingModules,
  
  // Steps
  getModuleSteps,
  createStep,
  updateStep,
  deleteStep,
  
  // Questions
  getQuestionsByStepId,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  
  // Options
  getOptionsByQuestionId,
  createOption,
  updateOption,
  deleteOption,
  
  // User Progress
  getUserProgress,
  updateUserProgress,
  
  // Quiz Attempts
  createQuizAttempt,
  
  // Campaigns
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  searchCampaigns,
  
  // Campaign Modules
  getCampaignModules,
  addCampaignModule,
  removeCampaignModule,
  
  // User Campaign Assignments
  getUserCampaignAssignments,
  assignUserToCampaign,
  updateUserCampaignAssignment,
  
  // Statistics
  getUserTrainingStats,
  getCampaignStats
};