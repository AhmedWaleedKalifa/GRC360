// db/migrate-email-verification.js
const { Client } = require("pg");
require("dotenv").config();

const MIGRATION_SQL = `
  -- Add email verification columns if they don't exist
  DO $$ 
  BEGIN 
    -- Add email_verified column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='email_verified') THEN
        ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add verification_code column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='verification_code') THEN
        ALTER TABLE users ADD COLUMN verification_code VARCHAR(10);
    END IF;
    
    -- Add verification_code_expires column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='verification_code_expires') THEN
        ALTER TABLE users ADD COLUMN verification_code_expires TIMESTAMP;
    END IF;
  END $$;

  -- Mark all existing users as verified
  UPDATE users SET email_verified = TRUE 
  WHERE email_verified IS NULL OR email_verified = FALSE;

  -- Create index for better performance
  CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
`;

let ssl = false;
if (process.env.DB_SSL_CERT_B64) {
  const sslCert = Buffer.from(process.env.DB_SSL_CERT_B64, "base64").toString("utf-8");
  ssl = { ca: sslCert, rejectUnauthorized: true };
}

async function migrate() {
  console.log("🚀 Starting email verification migration...");

  const client = new Client({
    connectionString: process.env.DEPLOYED_CONNECTION_STRING || process.env.CONNECTION_STRING,
    ssl,
  });

  try {
    await client.connect();
    
    // Run migration
    await client.query(MIGRATION_SQL);
    console.log("✅ Email verification migration completed successfully");
    
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();