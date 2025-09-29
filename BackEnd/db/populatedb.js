const { Client } = require("pg");
require("dotenv").config();

// =======================
// Database Schema (SQL)
// =======================
const SQL = `
    CREATE TABLE IF NOT EXISTS users (
        user_id  SERIAL PRIMARY KEY,
        role VARCHAR(20) DEFAULT 'user' NOT NULL CHECK (role IN ('admin', 'moderator', 'user', 'guest')),
        user_name     VARCHAR(100) NOT NULL,
        email         VARCHAR(100) UNIQUE NOT NULL,
        password      VARCHAR(100) NOT NULL,
        job_title     VARCHAR(100),
        phone         VARCHAR(20),
        last_login    TIMESTAMP,
        is_active     BOOLEAN DEFAULT TRUE,
        created_at    TIMESTAMP DEFAULT NOW(),
        updated_at    TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS compliance_frameworks (
        framework_id   VARCHAR(50) PRIMARY KEY,
        framework_name VARCHAR(100) NOT NULL,
        description    TEXT,
        created_at     TIMESTAMP DEFAULT NOW(),
        updated_at     TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS compliance_requirements (
        requirement_id VARCHAR(50) PRIMARY KEY,
        framework_id   VARCHAR(50) NOT NULL REFERENCES compliance_frameworks(framework_id) ON DELETE CASCADE,
        requirement_name VARCHAR(255) NOT NULL,
        reference      VARCHAR(50),
        created_at     TIMESTAMP DEFAULT NOW(),
        updated_at     TIMESTAMP DEFAULT NOW()
    );

 CREATE TABLE IF NOT EXISTS compliance_controls (
    control_id    VARCHAR(50) PRIMARY KEY,
    requirement_id VARCHAR(50) NOT NULL REFERENCES compliance_requirements(requirement_id) ON DELETE CASCADE,
    control_name  VARCHAR(255) NOT NULL,
    status        VARCHAR(50) DEFAULT 'not compliant' NOT NULL
        CHECK (status IN ('compliant', 'partially compliant', 'not compliant')),
    owner         INT REFERENCES users(user_id) ON DELETE SET NULL,
    last_reviewed DATE,
    reference     VARCHAR(50),
    notes         TEXT,
    description   TEXT,
    attachment    TEXT,
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);
    CREATE TABLE IF NOT EXISTS configurations (
        config_id SERIAL PRIMARY KEY,
        key       VARCHAR(100) UNIQUE NOT NULL,
        value     VARCHAR(255),
        description TEXT
    );

    CREATE TABLE IF NOT EXISTS governance_items (
        governance_id SERIAL PRIMARY KEY,
        governance_name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL
            CHECK (type IN ('policy', 'procedure', 'standard', 'guideline', 'framework')),
        owner INT REFERENCES users(user_id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'draft' NOT NULL
            CHECK (status IN ('draft', 'under_review', 'approved', 'active', 'archived', 'expired')),
        effective_date DATE,
        expiry_date DATE,
        next_review DATE,
        last_reviewed DATE,
        approval_status VARCHAR(50) DEFAULT 'pending'
            CHECK (approval_status IN ('pending', 'approved', 'rejected', 'requires_changes')),
        approver INT REFERENCES users(user_id) ON DELETE SET NULL,
        latest_change_summary TEXT,
        attachment TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS governance_risks (
        governance_id INT NOT NULL REFERENCES governance_items(governance_id) ON DELETE CASCADE,
        risk_id       INT NOT NULL, 
        PRIMARY KEY (governance_id, risk_id)
    );

    CREATE TABLE IF NOT EXISTS governance_frameworks (
        governance_id INT NOT NULL REFERENCES governance_items(governance_id) ON DELETE CASCADE,
        framework_id  VARCHAR(50) NOT NULL REFERENCES compliance_frameworks(framework_id) ON DELETE CASCADE,
        PRIMARY KEY (governance_id, framework_id)
    );

    CREATE TABLE IF NOT EXISTS risks (
        risk_id      SERIAL PRIMARY KEY,
        title        VARCHAR(255) NOT NULL,
        description  TEXT,
        category     VARCHAR(100),
        type         VARCHAR(100),
        status       VARCHAR(50) DEFAULT 'open'
            CHECK (status IN ('open', 'in_progress', 'closed', 'mitigated')),
        severity     VARCHAR(50)
            CHECK (severity IN ('low', 'medium', 'high', 'critical')),
        impact       VARCHAR(50),
        likelihood   VARCHAR(50),
        owner        INT REFERENCES users(user_id) ON DELETE SET NULL,
        last_reviewed DATE,
        due_date     DATE,
        notes        TEXT,
        created_at   TIMESTAMP DEFAULT NOW(),
        updated_at   TIMESTAMP DEFAULT NOW()
    );

    ALTER TABLE governance_risks
    ADD CONSTRAINT IF NOT EXISTS fk_gr_risk
    FOREIGN KEY (risk_id) REFERENCES risks(risk_id) ON DELETE CASCADE;

    CREATE TABLE IF NOT EXISTS incidents (
        incident_id SERIAL PRIMARY KEY,
        title       VARCHAR(255),
        category    VARCHAR(100) NOT NULL
            CHECK (category IN ('security', 'compliance', 'operational', 'technical', 'physical', 'environmental', 'personnel', 'other')),
        status      VARCHAR(50) DEFAULT 'reported' NOT NULL
            CHECK (status IN ('reported', 'investigating', 'contained', 'open', 'resolved', 'closed', 'reopened')),
        severity    VARCHAR(50) NOT NULL
            CHECK (severity IN ('low', 'medium', 'high', 'critical')),
        priority    VARCHAR(50) DEFAULT 'medium'
            CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        reported_at TIMESTAMP DEFAULT NOW() NOT NULL,
        detected_at TIMESTAMP,
        owner       INT REFERENCES users(user_id) ON DELETE SET NULL,
        description TEXT,
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS threats (
        threat_id   SERIAL PRIMARY KEY,
        name        VARCHAR(255),
        message     TEXT,
        description TEXT,
        category    VARCHAR(100) NOT NULL
            CHECK (category IN ('malware', 'phishing', 'insider_threat', 'ddos', 'data_breach', 'physical_breach', 'social_engineering', 'zero_day', 'ransomware', 'supply_chain', 'other')),
        severity    VARCHAR(50) NOT NULL
            CHECK (severity IN ('informational', 'low', 'medium', 'high', 'critical')),
        detected_at TIMESTAMP DEFAULT NOW() NOT NULL,
        created_at  TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
        audit_id SERIAL PRIMARY KEY,
        user_id  INT REFERENCES users(user_id) ON DELETE SET NULL,
        action   VARCHAR(50) NOT NULL,
        entity   VARCHAR(100) NOT NULL,
        entity_id INT,
        timestamp TIMESTAMP DEFAULT NOW(),
        details  TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_risks_owner ON risks(owner);
    CREATE INDEX IF NOT EXISTS idx_incidents_owner ON incidents(owner);
    CREATE INDEX IF NOT EXISTS idx_threats_detected_at ON threats(detected_at);
`;
// const SQL = `
// -- Use transaction for safety
// BEGIN;

// -- First, check if the constraint exists and drop it if it does
// DO $$ 
// BEGIN 
//     IF EXISTS (
//         SELECT 1 FROM information_schema.table_constraints 
//         WHERE constraint_name = 'compliance_controls_status_check' 
//         AND table_name = 'compliance_controls'
//     ) THEN
//         ALTER TABLE compliance_controls DROP CONSTRAINT compliance_controls_status_check;
//     END IF;
// END $$;

// -- Update all existing records to 'not compliant'
// UPDATE compliance_controls SET status = 'not compliant';

// -- Add the new check constraint
// ALTER TABLE compliance_controls 
// ADD CONSTRAINT compliance_controls_status_check 
// CHECK (status IN ('compliant', 'partially compliant', 'not compliant'));

// -- Update the default value
// ALTER TABLE compliance_controls 
// ALTER COLUMN status SET DEFAULT 'not compliant';

// COMMIT;
// `;
// =======================
// SSL Setup
// =======================
let ssl = false;
if (process.env.DB_SSL_CERT_B64) {
  const sslCert = Buffer.from(process.env.DB_SSL_CERT_B64, "base64").toString("utf-8");
  ssl = { ca: sslCert, rejectUnauthorized: true };
}

// =======================
// Main Seeder
// =======================
async function main() {
  console.log("🚀 Starting database seed...");

  const client = new Client({
    connectionString: process.env.DEPLOYED_CONNECTION_STRING || process.env.CONNECTION_STRING,
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
