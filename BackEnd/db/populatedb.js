const { Client } = require("pg");
const path = require("node:path");
const fs = require("fs");
require("dotenv").config();
const SQL = `
    CREATE TABLE users (
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


    CREATE TABLE compliance_frameworks (
        framework_id   VARCHAR(50) PRIMARY KEY,
        framework_name VARCHAR(100) NOT NULL,
        description    TEXT,
        created_at     TIMESTAMP DEFAULT NOW(),
        updated_at     TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE compliance_requirements (
        requirement_id VARCHAR(50) PRIMARY KEY,
        framework_id   VARCHAR(50) NOT NULL REFERENCES compliance_frameworks(framework_id) ON DELETE CASCADE,
        requirement_name VARCHAR(255) NOT NULL,
        reference      VARCHAR(50),
        created_at     TIMESTAMP DEFAULT NOW(),
        updated_at     TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE compliance_controls (
        control_id    VARCHAR(50) PRIMARY KEY,
        requirement_id VARCHAR(50) NOT NULL REFERENCES compliance_requirements(requirement_id) ON DELETE CASCADE,
        control_name  VARCHAR(255) NOT NULL,
        status        VARCHAR(50) DEFAULT 'draft' NOT NULL
            CHECK (status IN ('draft', 'implemented', 'testing', 'operational', 'retired')),
        owner         INT REFERENCES users(user_id) ON DELETE SET NULL,
        last_reviewed DATE,
        reference     VARCHAR(50),
        notes         TEXT,
        description   TEXT,
        attachment    TEXT,
        created_at    TIMESTAMP DEFAULT NOW(),
        updated_at    TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE configurations (
        config_id SERIAL PRIMARY KEY,
        key       VARCHAR(100) UNIQUE NOT NULL,
        value     VARCHAR(255),
        description TEXT
    );

    CREATE TABLE governance_items (
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

    CREATE TABLE governance_risks (
        governance_id INT NOT NULL REFERENCES governance_items(governance_id) ON DELETE CASCADE,
        risk_id       INT NOT NULL, 
        PRIMARY KEY (governance_id, risk_id)
    );

    CREATE TABLE governance_frameworks (
        governance_id INT NOT NULL REFERENCES governance_items(governance_id) ON DELETE CASCADE,
        framework_id  VARCHAR(50) NOT NULL REFERENCES compliance_frameworks(framework_id) ON DELETE CASCADE,
        PRIMARY KEY (governance_id, framework_id)
    );

    CREATE TABLE risks (
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
    ADD CONSTRAINT fk_gr_risk
    FOREIGN KEY (risk_id) REFERENCES risks(risk_id) ON DELETE CASCADE;

    CREATE TABLE incidents (
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

    CREATE TABLE threats (
        threat_id   SERIAL PRIMARY KEY,
        name        VARCHAR(255),          -- short name/title of threat
        message     TEXT,                  -- primary message or alert
        description TEXT,
        category    VARCHAR(100) NOT NULL
            CHECK (category IN ('malware', 'phishing', 'insider_threat', 'ddos', 'data_breach', 'physical_breach', 'social_engineering', 'zero_day', 'ransomware', 'supply_chain', 'other')),
        severity    VARCHAR(50) NOT NULL
            CHECK (severity IN ('informational', 'low', 'medium', 'high', 'critical')),
        detected_at TIMESTAMP DEFAULT NOW() NOT NULL,
        created_at  TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE audit_logs (
        audit_id SERIAL PRIMARY KEY,
        user_id  INT REFERENCES users(user_id) ON DELETE SET NULL,
        action   VARCHAR(50) NOT NULL,
        entity   VARCHAR(100) NOT NULL,
        entity_id INT,
        timestamp TIMESTAMP DEFAULT NOW(),
        details  TEXT
    );

    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_risks_owner ON risks(owner);
    CREATE INDEX idx_incidents_owner ON incidents(owner);
    CREATE INDEX idx_threats_detected_at ON threats(detected_at);
`;


//drop
// const SQL=`
// DROP TABLE IF EXISTS audit_logs CASCADE;
// DROP TABLE IF EXISTS threats CASCADE;
// DROP TABLE IF EXISTS incidents CASCADE;
// DROP TABLE IF EXISTS governance_frameworks CASCADE;
// DROP TABLE IF EXISTS governance_risks CASCADE;
// DROP TABLE IF EXISTS governance_items CASCADE;
// DROP TABLE IF EXISTS configurations CASCADE;
// DROP TABLE IF EXISTS compliance_controls CASCADE;
// DROP TABLE IF EXISTS compliance_requirements CASCADE;
// DROP TABLE IF EXISTS compliance_frameworks CASCADE;
// DROP TABLE IF EXISTS risks CASCADE;
// DROP TABLE IF EXISTS users CASCADE;

// `

async function main() {
  console.log("seeding...");
  const client = new Client({
    // connectionString:process.env.CONNECTION_STRING,

    connectionString: process.env.DEPLOYED_CONNECTION_STRING,
    ssl: {
      ca: fs.readFileSync(path.resolve(process.env.DB_SSL_CERT)).toString(),
      rejectUnauthorized: true,
    },
  });

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done");
}
main();
