const {Pool}=require("pg")
const path=require("node:path")
const fs = require('fs');
require("dotenv").config()
const pool = new Pool({
  // connectionString:process.env.CONNECTION_STRING,
    connectionString: process.env.DEPLOYED_CONNECTION_STRING,
    ssl: {
      ca: fs.readFileSync(path.resolve(process.env.DB_SSL_CERT)).toString(),
      rejectUnauthorized: true 
    }
  });
module.exports=pool