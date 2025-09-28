const express=require("express");const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const path = require("node:path");
const cors = require('cors');
const userExtractor = require('./middleware/userExtractor');

const app=express();
require('dotenv').config();

app.use(express.json());
app.use(userExtractor);

app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL2,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed for this origin: " + origin));
    }
  },
  credentials: true,
}));


const auditLogsRouter=require("./routes/auditLogsRouter")
const complianceItemsRouter=require("./routes/complianceItemsRouter")
const configurationsRouter=require("./routes/configurationsRouter")
const governanceItemsRouter=require("./routes/governanceItemsRouter")
const incidentsRouter=require("./routes/incidentsRouter")
const risksRouter=require("./routes/risksRouter")
const threatsRouter=require("./routes/threatsRouter")
const usersRouter=require("./routes/usersRouter")
const errorHandler = require("./middleware/errorHandler");


app.get("/",(req,res)=>res.send("Hello, world!!!"))
app.use("/auditLogs",auditLogsRouter)
app.use("/complianceItems",complianceItemsRouter)
app.use("/configurations",configurationsRouter)
app.use("/governanceItems",governanceItemsRouter)
app.use("/incidents",incidentsRouter)
app.use("/risks",risksRouter)
app.use("/threats",threatsRouter)
app.use("/users",usersRouter)




app.use(errorHandler);

const PORT=process.env.PORT||3003;
app.listen(PORT,(error)=>{
    if(error){
        throw error;
    }
    console.log("App running in http://localhost:"+PORT)
})