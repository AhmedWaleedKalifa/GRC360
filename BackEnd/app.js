const express=require("express");
const app=express();
require('dotenv').config();
const userRouter=require("./routes/userRouter")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>res.send("Hello, world!!!"))
app.use("/users",userRouter)


app.use((err, req, res, next) => {
    console.error(err);
    // We can now specify the `err.statusCode` that exists in our custom error class and if it does not exist it's probably an internal server error
    res.status(err.statusCode || 500).send(err.message);
});


const PORT=process.env.PORT||3003;
app.listen(PORT,(error)=>{
    if(error){
        throw error;
    }
    console.log("App running in http://localhost:"+PORT)
})