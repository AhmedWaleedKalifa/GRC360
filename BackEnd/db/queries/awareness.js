const pool = require("../pool");

// Training Modules
async function getAllTrainingModules() {
  const { rows } = await pool.query(
    "SELECT * FROM training_modules ORDER BY sort_order, created_at DESC"
  );
  return rows;
}

async function getTrainingModuleById(module_id) {
  const { rows } = await pool.query(
    "SELECT * FROM training_modules WHERE module_id = $1",
    [module_id]
  );
  return rows[0] || null;
}

async function addTrainingModule({
  title,
  description,
  duration,
  category,
  video_url,
  importance,
  status,
  sort_order,
}) {
  const { rows } = await pool.query(
    `INSERT INTO training_modules 
     (title, description, duration, category, video_url, importance, status, sort_order) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
     RETURNING *`,
    [
      title,
      description,
      duration,
      category,
      video_url,
      importance,
      status,
      sort_order,
    ]
  );
  return rows[0];
}

async function updateTrainingModule(module_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [module_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE training_modules SET ${set}, updated_at = NOW() WHERE module_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeTrainingModule(module_id) {
  const { rows } = await pool.query(
    "DELETE FROM training_modules WHERE module_id = $1 RETURNING *",
    [module_id]
  );
  return rows[0];
}

async function searchTrainingModules(query) {
  const { rows } = await pool.query(
    "SELECT * FROM training_modules WHERE title ILIKE $1 OR description ILIKE $1 OR category ILIKE $1",
    [`%${query}%`]
  );
  return rows;
}

// Training Module Steps
async function getStepsByModuleId(module_id) {
  const { rows } = await pool.query(
    "SELECT * FROM training_module_steps WHERE module_id = $1 ORDER BY sort_order",
    [module_id]
  );
  return rows;
}

async function getStepById(step_id) {
  const { rows } = await pool.query(
    "SELECT * FROM training_module_steps WHERE step_id = $1",
    [step_id]
  );
  return rows[0] || null;
}

async function addStep({
  module_id,
  step_type,
  title,
  content,
  duration,
  sort_order,
}) {
  const { rows } = await pool.query(
    `INSERT INTO training_module_steps 
     (module_id, step_type, title, content, duration, sort_order) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [module_id, step_type, title, content, duration, sort_order]
  );
  return rows[0];
}

async function updateStep(step_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [step_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE training_module_steps SET ${set} WHERE step_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeStep(step_id) {
  const { rows } = await pool.query(
    "DELETE FROM training_module_steps WHERE step_id = $1 RETURNING *",
    [step_id]
  );
  return rows[0];
}

// Quiz Questions
async function getQuestionsByStepId(step_id) {
  const { rows } = await pool.query(
    "SELECT * FROM quiz_questions WHERE step_id = $1 ORDER BY sort_order",
    [step_id]
  );
  return rows;
}

async function getQuestionById(question_id) {
  const { rows } = await pool.query(
    "SELECT * FROM quiz_questions WHERE question_id = $1",
    [question_id]
  );
  return rows[0] || null;
}

async function addQuestion({
  step_id,
  question_text,
  question_type,
  correct_answer,
  explanation,
  sort_order,
}) {
  const { rows } = await pool.query(
    `INSERT INTO quiz_questions 
     (step_id, question_text, question_type, correct_answer, explanation, sort_order) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [
      step_id,
      question_text,
      question_type,
      correct_answer,
      explanation,
      sort_order,
    ]
  );
  return rows[0];
}

async function updateQuestion(question_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [question_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE quiz_questions SET ${set} WHERE question_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeQuestion(question_id) {
  const { rows } = await pool.query(
    "DELETE FROM quiz_questions WHERE question_id = $1 RETURNING *",
    [question_id]
  );
  return rows[0];
}

// Quiz Options
async function getOptionsByQuestionId(question_id) {
  const { rows } = await pool.query(
    "SELECT * FROM quiz_options WHERE question_id = $1 ORDER BY option_order",
    [question_id]
  );
  return rows;
}

async function addOption({ question_id, option_text, option_order }) {
  const { rows } = await pool.query(
    `INSERT INTO quiz_options (question_id, option_text, option_order) 
     VALUES ($1, $2, $3) RETURNING *`,
    [question_id, option_text, option_order]
  );
  return rows[0];
}

async function updateOption(option_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [option_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE quiz_options SET ${set} WHERE option_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeOption(option_id) {
  const { rows } = await pool.query(
    "DELETE FROM quiz_options WHERE option_id = $1 RETURNING *",
    [option_id]
  );
  return rows[0];
}

// User Training Progress
async function getUserProgress(user_id, module_id) {
  const { rows } = await pool.query(
    "SELECT * FROM user_training_progress WHERE user_id = $1 AND module_id = $2",
    [user_id, module_id]
  );
  return rows[0] || null;
}

async function getUserAllProgress(user_id) {
  const { rows } = await pool.query(
    `SELECT utp.*, tm.title, tm.category, tm.duration 
     FROM user_training_progress utp 
     JOIN training_modules tm ON utp.module_id = tm.module_id 
     WHERE utp.user_id = $1 
     ORDER BY utp.updated_at DESC`,
    [user_id]
  );
  return rows;
}

async function updateUserProgress({
  user_id,
  module_id,
  status,
  progress_percentage,
  score,
  time_spent,
}) {
  const existing = await getUserProgress(user_id, module_id);

  if (existing) {
    const { rows } = await pool.query(
      `UPDATE user_training_progress 
       SET status = $3, progress_percentage = $4, score = $5, time_spent = $6, 
           last_accessed = NOW(), updated_at = NOW(),
           started_at = CASE WHEN $3 != 'not_started' AND started_at IS NULL THEN NOW() ELSE started_at END,
           completed_at = CASE WHEN $3 = 'completed' THEN NOW() ELSE completed_at END
       WHERE user_id = $1 AND module_id = $2 
       RETURNING *`,
      [user_id, module_id, status, progress_percentage, score, time_spent]
    );
    return rows[0];
  } else {
    const { rows } = await pool.query(
      `INSERT INTO user_training_progress 
       (user_id, module_id, status, progress_percentage, score, time_spent, started_at, completed_at) 
       VALUES ($1, $2, $3, $4, $5, $6, 
               CASE WHEN $3 != 'not_started' THEN NOW() ELSE NULL END,
               CASE WHEN $3 = 'completed' THEN NOW() ELSE NULL END) 
       RETURNING *`,
      [user_id, module_id, status, progress_percentage, score, time_spent]
    );
    return rows[0];
  }
}

// User Quiz Attempts
async function createQuizAttempt({
  user_id,
  module_id,
  score,
  time_spent,
  total_questions,
  correct_answers,
}) {
  const passed = score >= 70;
  const { rows } = await pool.query(
    `INSERT INTO user_quiz_attempts 
     (user_id, module_id, score, time_spent, total_questions, correct_answers, passed) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING *`,
    [
      user_id,
      module_id,
      score,
      time_spent,
      total_questions,
      correct_answers,
      passed,
    ]
  );
  return rows[0];
}

async function getUserQuizAttempts(user_id, module_id) {
  const { rows } = await pool.query(
    "SELECT * FROM user_quiz_attempts WHERE user_id = $1 AND module_id = $2 ORDER BY completed_at DESC",
    [user_id, module_id]
  );
  return rows;
}

// User Question Answers
async function saveQuestionAnswers(attempt_id, answers) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const answer of answers) {
      await client.query(
        `INSERT INTO user_question_answers 
         (attempt_id, question_id, selected_option, is_correct) 
         VALUES ($1, $2, $3, $4)`,
        [
          attempt_id,
          answer.question_id,
          answer.selected_option,
          answer.is_correct,
        ]
      );
    }

    await client.query("COMMIT");
    return { success: true, count: answers.length };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Awareness Campaigns
async function getAllCampaigns() {
  const { rows } = await pool.query(
    "SELECT * FROM awareness_campaigns ORDER BY created_at DESC"
  );
  return rows;
}

async function getCampaignById(campaign_id) {
  const { rows } = await pool.query(
    "SELECT * FROM awareness_campaigns WHERE campaign_id = $1",
    [campaign_id]
  );
  return rows[0] || null;
}

async function addCampaign({
  title,
  description,
  status,
  start_date,
  end_date,
  target_audience,
  created_by,
}) {
  const { rows } = await pool.query(
    `INSERT INTO awareness_campaigns 
     (title, description, status, start_date, end_date, target_audience, created_by) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING *`,
    [
      title,
      description,
      status,
      start_date,
      end_date,
      target_audience,
      created_by,
    ]
  );
  return rows[0];
}

async function updateCampaign(campaign_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [campaign_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE awareness_campaigns SET ${set}, updated_at = NOW() WHERE campaign_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeCampaign(campaign_id) {
  const { rows } = await pool.query(
    "DELETE FROM awareness_campaigns WHERE campaign_id = $1 RETURNING *",
    [campaign_id]
  );
  return rows[0];
}

async function searchCampaigns(query) {
  const { rows } = await pool.query(
    "SELECT * FROM awareness_campaigns WHERE title ILIKE $1 OR description ILIKE $1",
    [`%${query}%`]
  );
  return rows;
}

// Campaign Modules
async function getCampaignModules(campaign_id) {
  const { rows } = await pool.query(
    `SELECT cm.*, tm.title, tm.description, tm.duration, tm.category 
     FROM campaign_modules cm 
     JOIN training_modules tm ON cm.module_id = tm.module_id 
     WHERE cm.campaign_id = $1 
     ORDER BY cm.sort_order`,
    [campaign_id]
  );
  return rows;
}

async function addCampaignModule({
  campaign_id,
  module_id,
  sort_order,
  assigned_date,
  due_date,
}) {
  const { rows } = await pool.query(
    `INSERT INTO campaign_modules 
     (campaign_id, module_id, sort_order, assigned_date, due_date) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [campaign_id, module_id, sort_order, assigned_date, due_date]
  );
  return rows[0];
}

async function removeCampaignModule(campaign_id, module_id) {
  const { rows } = await pool.query(
    "DELETE FROM campaign_modules WHERE campaign_id = $1 AND module_id = $2 RETURNING *",
    [campaign_id, module_id]
  );
  return rows[0];
}

// User Campaign Assignments
async function getUserCampaignAssignments(user_id) {
  const { rows } = await pool.query(
    `SELECT uca.*, ac.title, ac.description, ac.start_date, ac.end_date, ac.status as campaign_status
     FROM user_campaign_assignments uca 
     JOIN awareness_campaigns ac ON uca.campaign_id = ac.campaign_id 
     WHERE uca.user_id = $1 
     ORDER BY uca.assigned_date DESC`,
    [user_id]
  );
  return rows;
}

async function assignUserToCampaign({ user_id, campaign_id }) {
  const { rows } = await pool.query(
    `INSERT INTO user_campaign_assignments (user_id, campaign_id) 
     VALUES ($1, $2) 
     ON CONFLICT (user_id, campaign_id) DO UPDATE SET
     status = 'assigned', assigned_date = NOW()
     RETURNING *`,
    [user_id, campaign_id]
  );
  return rows[0];
}

async function updateUserCampaignAssignment(assignment_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [assignment_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE user_campaign_assignments SET ${set} WHERE assignment_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

// Statistics
async function getUserTrainingStats(user_id) {
  const { rows } = await pool.query(
    `SELECT 
       COUNT(*) as total_modules,
       COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_modules,
       COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_modules,
       COUNT(CASE WHEN status = 'not_started' THEN 1 END) as not_started_modules,
       COALESCE(AVG(progress_percentage), 0) as overall_progress,
       COALESCE(AVG(score), 0) as average_score
     FROM user_training_progress 
     WHERE user_id = $1`,
    [user_id]
  );
  return rows[0];
}

async function getCampaignStats(campaign_id) {
  const { rows } = await pool.query(
    `SELECT 
       COUNT(*) as total_participants,
       COUNT(CASE WHEN uca.status = 'completed' THEN 1 END) as completed_participants,
       COUNT(CASE WHEN uca.status = 'in_progress' THEN 1 END) as in_progress_participants,
       ROUND(
         COUNT(CASE WHEN uca.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)
       ) as completion_rate
     FROM user_campaign_assignments uca 
     WHERE uca.campaign_id = $1`,
    [campaign_id]
  );
  return rows[0];
}

// Questions
async function addQuestion({
  step_id,
  question_text,
  question_type,
  correct_answer,
  explanation,
  sort_order,
}) {
  const { rows } = await pool.query(
    `INSERT INTO quiz_questions 
     (step_id, question_text, question_type, correct_answer, explanation, sort_order) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [
      step_id,
      question_text,
      question_type,
      correct_answer,
      explanation,
      sort_order,
    ]
  );
  return rows[0];
}

async function updateQuestion(question_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [question_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE quiz_questions SET ${set} WHERE question_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeQuestion(question_id) {
  const { rows } = await pool.query(
    "DELETE FROM quiz_questions WHERE question_id = $1 RETURNING *",
    [question_id]
  );
  return rows[0];
}

// Options
async function addOption({ question_id, option_text, option_order }) {
  const { rows } = await pool.query(
    `INSERT INTO quiz_options (question_id, option_text, option_order) 
     VALUES ($1, $2, $3) RETURNING *`,
    [question_id, option_text, option_order]
  );
  return rows[0];
}

async function updateOption(option_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [option_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE quiz_options SET ${set} WHERE option_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeOption(option_id) {
  const { rows } = await pool.query(
    "DELETE FROM quiz_options WHERE option_id = $1 RETURNING *",
    [option_id]
  );
  return rows[0];
}
// Steps - Add update and delete
async function updateStep(step_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [step_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE training_module_steps SET ${set} WHERE step_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

async function removeStep(step_id) {
  const { rows } = await pool.query(
    "DELETE FROM training_module_steps WHERE step_id = $1 RETURNING *",
    [step_id]
  );
  return rows[0];
}

// Campaign Modules - Add get and remove
async function removeCampaignModule(campaign_id, module_id) {
  const { rows } = await pool.query(
    "DELETE FROM campaign_modules WHERE campaign_id = $1 AND module_id = $2 RETURNING *",
    [campaign_id, module_id]
  );
  return rows[0];
}

// User Campaign Assignments - Add update
async function updateUserCampaignAssignment(assignment_id, fields) {
  const set = Object.keys(fields)
    .map((key, idx) => `${key} = $${idx + 2}`)
    .join(", ");
  const values = [assignment_id, ...Object.values(fields)];

  const { rows } = await pool.query(
    `UPDATE user_campaign_assignments SET ${set} WHERE assignment_id = $1 RETURNING *`,
    values
  );
  return rows[0];
}

// Make sure to export all these new functions from your queries file
module.exports = {
  // Training Modules
  getAllTrainingModules,
  getTrainingModuleById,
  addTrainingModule,
  updateTrainingModule,
  removeTrainingModule,
  searchTrainingModules,

  // Steps
  getStepsByModuleId,
  getStepById,
  addStep,
  updateStep,
  removeStep,

  // Questions
  getQuestionsByStepId,
  getQuestionById,
  addQuestion,
  updateQuestion,
  removeQuestion,

  // Options
  getOptionsByQuestionId,
  addOption,
  updateOption,
  removeOption,

  // User Progress
  getUserProgress,
  getUserAllProgress,
  updateUserProgress,

  // Quiz Attempts
  createQuizAttempt,
  getUserQuizAttempts,
  saveQuestionAnswers,

  // Campaigns
  getAllCampaigns,
  getCampaignById,
  addCampaign,
  updateCampaign,
  removeCampaign,
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
  getCampaignStats,

  //questions

  addQuestion,
  updateQuestion,
  removeQuestion,
  addOption,
  updateOption,
  removeOption,
  updateStep,
  removeStep,
  removeCampaignModule,
  updateUserCampaignAssignment,
};
