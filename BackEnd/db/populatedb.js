const { Client } = require("pg");
require("dotenv").config();

// =======================
// Database Schema (SQL)
// =======================
// const SQL = `
//     CREATE TABLE IF NOT EXISTS users (
//         user_id  SERIAL PRIMARY KEY,
//         role VARCHAR(20) DEFAULT 'user' NOT NULL CHECK (role IN ('admin', 'moderator', 'user', 'guest')),
//         user_name     VARCHAR(100) NOT NULL,
//         email         VARCHAR(100) UNIQUE NOT NULL,
//         password      VARCHAR(100) NOT NULL,
//         job_title     VARCHAR(100),
//         phone         VARCHAR(20),
//         last_login    TIMESTAMP,
//         is_active     BOOLEAN DEFAULT TRUE,
//         created_at    TIMESTAMP DEFAULT NOW(),
//         updated_at    TIMESTAMP DEFAULT NOW()
//     );

//     CREATE TABLE IF NOT EXISTS compliance_frameworks (
//         framework_id   VARCHAR(50) PRIMARY KEY,
//         framework_name VARCHAR(100) NOT NULL,
//         description    TEXT,
//         created_at     TIMESTAMP DEFAULT NOW(),
//         updated_at     TIMESTAMP DEFAULT NOW()
//     );

//     CREATE TABLE IF NOT EXISTS compliance_requirements (
//         requirement_id VARCHAR(50) PRIMARY KEY,
//         framework_id   VARCHAR(50) NOT NULL REFERENCES compliance_frameworks(framework_id) ON DELETE CASCADE,
//         requirement_name VARCHAR(255) NOT NULL,
//         reference      VARCHAR(50),
//         created_at     TIMESTAMP DEFAULT NOW(),
//         updated_at     TIMESTAMP DEFAULT NOW()
//     );

//  CREATE TABLE IF NOT EXISTS compliance_controls (
//     control_id    VARCHAR(50) PRIMARY KEY,
//     requirement_id VARCHAR(50) NOT NULL REFERENCES compliance_requirements(requirement_id) ON DELETE CASCADE,
//     control_name  VARCHAR(255) NOT NULL,
//     status        VARCHAR(50) DEFAULT 'not compliant' NOT NULL
//         CHECK (status IN ('compliant', 'partially compliant', 'not compliant')),
//     owner         INT REFERENCES users(user_id) ON DELETE SET NULL,
//     last_reviewed DATE,
//     reference     VARCHAR(50),
//     notes         TEXT,
//     description   TEXT,
//     attachment    TEXT,
//     created_at    TIMESTAMP DEFAULT NOW(),
//     updated_at    TIMESTAMP DEFAULT NOW()
// );
//     CREATE TABLE IF NOT EXISTS configurations (
//         config_id SERIAL PRIMARY KEY,
//         key       VARCHAR(100) UNIQUE NOT NULL,
//         value     VARCHAR(255),
//         description TEXT
//     );

//     CREATE TABLE IF NOT EXISTS governance_items (
//         governance_id SERIAL PRIMARY KEY,
//         governance_name VARCHAR(255) NOT NULL,
//         type VARCHAR(50) NOT NULL
//             CHECK (type IN ('policy', 'procedure', 'standard', 'guideline', 'framework')),
//         owner INT REFERENCES users(user_id) ON DELETE SET NULL,
//         status VARCHAR(50) DEFAULT 'draft' NOT NULL
//             CHECK (status IN ('draft', 'under_review', 'approved', 'active', 'archived', 'expired')),
//         effective_date DATE,
//         expiry_date DATE,
//         next_review DATE,
//         last_reviewed DATE,
//         approval_status VARCHAR(50) DEFAULT 'pending'
//             CHECK (approval_status IN ('pending', 'approved', 'rejected', 'requires_changes')),
//         approver INT REFERENCES users(user_id) ON DELETE SET NULL,
//         latest_change_summary TEXT,
//         attachment TEXT,
//         created_at TIMESTAMP DEFAULT NOW(),
//         updated_at TIMESTAMP DEFAULT NOW()
//     );

//     CREATE TABLE IF NOT EXISTS governance_risks (
//         governance_id INT NOT NULL REFERENCES governance_items(governance_id) ON DELETE CASCADE,
//         risk_id       INT NOT NULL,
//         PRIMARY KEY (governance_id, risk_id)
//     );

//     CREATE TABLE IF NOT EXISTS governance_frameworks (
//         governance_id INT NOT NULL REFERENCES governance_items(governance_id) ON DELETE CASCADE,
//         framework_id  VARCHAR(50) NOT NULL REFERENCES compliance_frameworks(framework_id) ON DELETE CASCADE,
//         PRIMARY KEY (governance_id, framework_id)
//     );

//     CREATE TABLE IF NOT EXISTS risks (
//         risk_id      SERIAL PRIMARY KEY,
//         title        VARCHAR(255) NOT NULL,
//         description  TEXT,
//         category     VARCHAR(100),
//         type         VARCHAR(100),
//         status       VARCHAR(50) DEFAULT 'open'
//             CHECK (status IN ('open', 'in_progress', 'closed', 'mitigated')),
//         severity     VARCHAR(50)
//             CHECK (severity IN ('low', 'medium', 'high', 'critical')),
//         impact       VARCHAR(50),
//         likelihood   VARCHAR(50),
//         owner        INT REFERENCES users(user_id) ON DELETE SET NULL,
//         last_reviewed DATE,
//         due_date     DATE,
//         notes        TEXT,
//         created_at   TIMESTAMP DEFAULT NOW(),
//         updated_at   TIMESTAMP DEFAULT NOW()
//     );

//     ALTER TABLE governance_risks
//     ADD CONSTRAINT IF NOT EXISTS fk_gr_risk
//     FOREIGN KEY (risk_id) REFERENCES risks(risk_id) ON DELETE CASCADE;

//     CREATE TABLE IF NOT EXISTS incidents (
//         incident_id SERIAL PRIMARY KEY,
//         title       VARCHAR(255),
//         category    VARCHAR(100) NOT NULL
//             CHECK (category IN ('security', 'compliance', 'operational', 'technical', 'physical', 'environmental', 'personnel', 'other')),
//         status      VARCHAR(50) DEFAULT 'reported' NOT NULL
//             CHECK (status IN ('reported', 'investigating', 'contained', 'open', 'resolved', 'closed', 'reopened')),
//         severity    VARCHAR(50) NOT NULL
//             CHECK (severity IN ('low', 'medium', 'high', 'critical')),
//         priority    VARCHAR(50) DEFAULT 'medium'
//             CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
//         reported_at TIMESTAMP DEFAULT NOW() NOT NULL,
//         detected_at TIMESTAMP,
//         owner       INT REFERENCES users(user_id) ON DELETE SET NULL,
//         description TEXT,
//         created_at  TIMESTAMP DEFAULT NOW(),
//         updated_at  TIMESTAMP DEFAULT NOW()
//     );

//     CREATE TABLE IF NOT EXISTS threats (
//         threat_id   SERIAL PRIMARY KEY,
//         name        VARCHAR(255),
//         message     TEXT,
//         description TEXT,
//         category    VARCHAR(100) NOT NULL
//             CHECK (category IN ('malware', 'phishing', 'insider_threat', 'ddos', 'data_breach', 'physical_breach', 'social_engineering', 'zero_day', 'ransomware', 'supply_chain', 'other')),
//         severity    VARCHAR(50) NOT NULL
//             CHECK (severity IN ('informational', 'low', 'medium', 'high', 'critical')),
//         detected_at TIMESTAMP DEFAULT NOW() NOT NULL,
//         created_at  TIMESTAMP DEFAULT NOW()
//     );

//     CREATE TABLE IF NOT EXISTS audit_logs (
//         audit_id SERIAL PRIMARY KEY,
//         user_id  INT REFERENCES users(user_id) ON DELETE SET NULL,
//         action   VARCHAR(50) NOT NULL,
//         entity   VARCHAR(100) NOT NULL,
//         entity_id INT,
//         timestamp TIMESTAMP DEFAULT NOW(),
//         details  TEXT
//     );
// CREATE TABLE IF NOT EXISTS training_modules (
//     module_id SERIAL PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     description TEXT,
//     duration VARCHAR(20),
//     category VARCHAR(100) NOT NULL,
//     video_url VARCHAR(500),
//     importance VARCHAR(20) DEFAULT 'Medium' CHECK (importance IN ('Low', 'Medium', 'High')),
//     status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
//     sort_order INT DEFAULT 0,
//     created_at TIMESTAMP DEFAULT NOW(),
//     updated_at TIMESTAMP DEFAULT NOW()
// );
// CREATE TABLE IF NOT EXISTS training_module_steps (
//     step_id SERIAL PRIMARY KEY,
//     module_id INT NOT NULL REFERENCES training_modules(module_id) ON DELETE CASCADE,
//     step_type VARCHAR(20) NOT NULL CHECK (step_type IN ('video', 'quiz', 'document')),
//     title VARCHAR(255) NOT NULL,
//     content TEXT,
//     duration VARCHAR(20),
//     sort_order INT DEFAULT 0,
//     created_at TIMESTAMP DEFAULT NOW()
// );
// CREATE TABLE IF NOT EXISTS quiz_questions (
//     question_id SERIAL PRIMARY KEY,
//     step_id INT NOT NULL REFERENCES training_module_steps(step_id) ON DELETE CASCADE,
//     question_text TEXT NOT NULL,
//     question_type VARCHAR(20) DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false')),
//     correct_answer INT NOT NULL,
//     explanation TEXT,
//     sort_order INT DEFAULT 0,
//     created_at TIMESTAMP DEFAULT NOW()
// );
// CREATE TABLE IF NOT EXISTS quiz_options (
//     option_id SERIAL PRIMARY KEY,
//     question_id INT NOT NULL REFERENCES quiz_questions(question_id) ON DELETE CASCADE,
//     option_text TEXT NOT NULL,
//     option_order INT NOT NULL,
//     created_at TIMESTAMP DEFAULT NOW()
// );
// CREATE TABLE IF NOT EXISTS user_training_progress (
//     progress_id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
//     module_id INT NOT NULL REFERENCES training_modules(module_id) ON DELETE CASCADE,
//     status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
//     progress_percentage INT DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
//     score INT CHECK (score >= 0 AND score <= 100),
//     started_at TIMESTAMP,
//     completed_at TIMESTAMP,
//     time_spent INT DEFAULT 0, -- in seconds
//     last_accessed TIMESTAMP DEFAULT NOW(),
//     created_at TIMESTAMP DEFAULT NOW(),
//     updated_at TIMESTAMP DEFAULT NOW(),
//     UNIQUE(user_id, module_id)
// );
// CREATE TABLE IF NOT EXISTS user_quiz_attempts (
//     attempt_id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
//     module_id INT NOT NULL REFERENCES training_modules(module_id) ON DELETE CASCADE,
//     score INT NOT NULL CHECK (score >= 0 AND score <= 100),
//     time_spent INT NOT NULL, -- in seconds
//     total_questions INT NOT NULL,
//     correct_answers INT NOT NULL,
//     passed BOOLEAN DEFAULT FALSE,
//     completed_at TIMESTAMP DEFAULT NOW(),
//     created_at TIMESTAMP DEFAULT NOW()
// );
// CREATE TABLE IF NOT EXISTS user_question_answers (
//     answer_id SERIAL PRIMARY KEY,
//     attempt_id INT NOT NULL REFERENCES user_quiz_attempts(attempt_id) ON DELETE CASCADE,
//     question_id INT NOT NULL REFERENCES quiz_questions(question_id) ON DELETE CASCADE,
//     selected_option INT NOT NULL,
//     is_correct BOOLEAN NOT NULL,
//     answered_at TIMESTAMP DEFAULT NOW()
// );
// CREATE TABLE IF NOT EXISTS awareness_campaigns (
//     campaign_id SERIAL PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     description TEXT,
//     status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
//     start_date DATE NOT NULL,
//     end_date DATE NOT NULL,
//     target_audience VARCHAR(100), -- or INT REFERENCES departments(department_id) if you have departments
//     created_by INT REFERENCES users(user_id),
//     created_at TIMESTAMP DEFAULT NOW(),
//     updated_at TIMESTAMP DEFAULT NOW()
// );

// CREATE TABLE IF NOT EXISTS campaign_modules (
//     campaign_id INT NOT NULL REFERENCES awareness_campaigns(campaign_id) ON DELETE CASCADE,
//     module_id INT NOT NULL REFERENCES training_modules(module_id) ON DELETE CASCADE,
//     sort_order INT DEFAULT 0,
//     assigned_date DATE,
//     due_date DATE,
//     created_at TIMESTAMP DEFAULT NOW(),
//     PRIMARY KEY (campaign_id, module_id)
// );
// CREATE TABLE IF NOT EXISTS user_campaign_assignments (
//     assignment_id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
//     campaign_id INT NOT NULL REFERENCES awareness_campaigns(campaign_id) ON DELETE CASCADE,
//     status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
//     assigned_date TIMESTAMP DEFAULT NOW(),
//     completed_date TIMESTAMP,
//     created_at TIMESTAMP DEFAULT NOW(),
//     UNIQUE(user_id, campaign_id)
// );

//     CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
//     CREATE INDEX IF NOT EXISTS idx_risks_owner ON risks(owner);
//     CREATE INDEX IF NOT EXISTS idx_incidents_owner ON incidents(owner);
//     CREATE INDEX IF NOT EXISTS idx_threats_detected_at ON threats(detected_at);

//     CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_training_progress(user_id);
//     CREATE INDEX IF NOT EXISTS idx_user_progress_module ON user_training_progress(module_id);
//     CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON user_quiz_attempts(user_id);
//     CREATE INDEX IF NOT EXISTS idx_campaign_modules_campaign ON campaign_modules(campaign_id);
//     CREATE INDEX IF NOT EXISTS idx_user_assignments_user ON user_campaign_assignments(user_id);
// `;
// const SQL = `
// CREATE TABLE IF NOT EXISTS training_modules (
//     module_id SERIAL PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     description TEXT,
//     duration VARCHAR(20),
//     category VARCHAR(100) NOT NULL,
//     video_url VARCHAR(500),
//     importance VARCHAR(20) DEFAULT 'Medium' CHECK (importance IN ('Low', 'Medium', 'High')),
//     status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
//     sort_order INT DEFAULT 0,
//     created_at TIMESTAMP DEFAULT NOW(),
//     updated_at TIMESTAMP DEFAULT NOW()
// );
// CREATE TABLE IF NOT EXISTS training_module_steps (
//     step_id SERIAL PRIMARY KEY,
//     module_id INT NOT NULL REFERENCES training_modules(module_id) ON DELETE CASCADE,
//     step_type VARCHAR(20) NOT NULL CHECK (step_type IN ('video', 'quiz', 'document')),
//     title VARCHAR(255) NOT NULL,
//     content TEXT,
//     duration VARCHAR(20),
//     sort_order INT DEFAULT 0,
//     created_at TIMESTAMP DEFAULT NOW()
// );
// CREATE TABLE IF NOT EXISTS quiz_questions (
//     question_id SERIAL PRIMARY KEY,
//     step_id INT NOT NULL REFERENCES training_module_steps(step_id) ON DELETE CASCADE,
//     question_text TEXT NOT NULL,
//     question_type VARCHAR(20) DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false')),
//     correct_answer INT NOT NULL,
//     explanation TEXT,
//     sort_order INT DEFAULT 0,
//     created_at TIMESTAMP DEFAULT NOW()
// );
// CREATE TABLE IF NOT EXISTS quiz_options (
//     option_id SERIAL PRIMARY KEY,
//     question_id INT NOT NULL REFERENCES quiz_questions(question_id) ON DELETE CASCADE,
//     option_text TEXT NOT NULL,
//     option_order INT NOT NULL,
//     created_at TIMESTAMP DEFAULT NOW()
// );
// CREATE TABLE IF NOT EXISTS user_training_progress (
//     progress_id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
//     module_id INT NOT NULL REFERENCES training_modules(module_id) ON DELETE CASCADE,
//     status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
//     progress_percentage INT DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
//     score INT CHECK (score >= 0 AND score <= 100),
//     started_at TIMESTAMP,
//     completed_at TIMESTAMP,
//     time_spent INT DEFAULT 0, -- in seconds
//     last_accessed TIMESTAMP DEFAULT NOW(),
//     created_at TIMESTAMP DEFAULT NOW(),
//     updated_at TIMESTAMP DEFAULT NOW(),
//     UNIQUE(user_id, module_id)
// );
// CREATE TABLE IF NOT EXISTS user_quiz_attempts (
//     attempt_id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
//     module_id INT NOT NULL REFERENCES training_modules(module_id) ON DELETE CASCADE,
//     score INT NOT NULL CHECK (score >= 0 AND score <= 100),
//     time_spent INT NOT NULL, -- in seconds
//     total_questions INT NOT NULL,
//     correct_answers INT NOT NULL,
//     passed BOOLEAN DEFAULT FALSE,
//     completed_at TIMESTAMP DEFAULT NOW(),
//     created_at TIMESTAMP DEFAULT NOW()
// );
// CREATE TABLE IF NOT EXISTS user_question_answers (
//     answer_id SERIAL PRIMARY KEY,
//     attempt_id INT NOT NULL REFERENCES user_quiz_attempts(attempt_id) ON DELETE CASCADE,
//     question_id INT NOT NULL REFERENCES quiz_questions(question_id) ON DELETE CASCADE,
//     selected_option INT NOT NULL,
//     is_correct BOOLEAN NOT NULL,
//     answered_at TIMESTAMP DEFAULT NOW()
// );
// CREATE TABLE IF NOT EXISTS awareness_campaigns (
//     campaign_id SERIAL PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     description TEXT,
//     status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
//     start_date DATE NOT NULL,
//     end_date DATE NOT NULL,
//     target_audience VARCHAR(100), -- or INT REFERENCES departments(department_id) if you have departments
//     created_by INT REFERENCES users(user_id),
//     created_at TIMESTAMP DEFAULT NOW(),
//     updated_at TIMESTAMP DEFAULT NOW()
// );

// CREATE TABLE IF NOT EXISTS campaign_modules (
//     campaign_id INT NOT NULL REFERENCES awareness_campaigns(campaign_id) ON DELETE CASCADE,
//     module_id INT NOT NULL REFERENCES training_modules(module_id) ON DELETE CASCADE,
//     sort_order INT DEFAULT 0,
//     assigned_date DATE,
//     due_date DATE,
//     created_at TIMESTAMP DEFAULT NOW(),
//     PRIMARY KEY (campaign_id, module_id)
// );
// CREATE TABLE IF NOT EXISTS user_campaign_assignments (
//     assignment_id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
//     campaign_id INT NOT NULL REFERENCES awareness_campaigns(campaign_id) ON DELETE CASCADE,
//     status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
//     assigned_date TIMESTAMP DEFAULT NOW(),
//     completed_date TIMESTAMP,
//     created_at TIMESTAMP DEFAULT NOW(),
//     UNIQUE(user_id, campaign_id)
// );
//  CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_training_progress(user_id);
//     CREATE INDEX IF NOT EXISTS idx_user_progress_module ON user_training_progress(module_id);
//     CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON user_quiz_attempts(user_id);
//     CREATE INDEX IF NOT EXISTS idx_campaign_modules_campaign ON campaign_modules(campaign_id);
//     CREATE INDEX IF NOT EXISTS idx_user_assignments_user ON user_campaign_assignments(user_id);
// `;
let ssl = false;
if (process.env.DB_SSL_CERT_B64) {
  const sslCert = Buffer.from(process.env.DB_SSL_CERT_B64, "base64").toString(
    "utf-8"
  );
  ssl = { ca: sslCert, rejectUnauthorized: true };
}

async function main() {
  console.log("🚀 Starting database seed...");

  const client = new Client({
    connectionString:
      process.env.DEPLOYED_CONNECTION_STRING || process.env.CONNECTION_STRING,
    ssl,
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("✅ Database schema created/updated successfully");
  } catch (err) {
    console.error("❌ Error running seed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
