const { Pool } = require("pg");
require("dotenv").config();

let ssl = false;

if (process.env.DB_SSL_CERT_B64) {
  const sslCert = Buffer.from(process.env.DB_SSL_CERT_B64, "base64").toString("utf-8");
  ssl = {
    ca: sslCert,
    rejectUnauthorized: true,
  };
}

const pool = new Pool({
  connectionString: process.env.DEPLOYED_CONNECTION_STRING || process.env.CONNECTION_STRING,
  ssl,
});

module.exports = pool;
