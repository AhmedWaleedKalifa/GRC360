const express=require("express");
const app=express();
require('dotenv').config();

app.get("/",(req,res)=>res.send("Hello, world!!!"))

const PORT=process.env.PORT||3003;

app.listen(PORT,(error)=>{
    if(error){
        throw error;
    }
    console.log("App running in http://localhost:"+PORT)
})