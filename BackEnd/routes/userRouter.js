const express=require("express")
const userController=require("../controllers/userController")
const userRouter=express.Router();
userRouter.get("/",userController.getUsers)
userRouter.get("/new",userController.getNewUser)
userRouter.post("/new",userController.createNewUser)
userRouter.get("/search",userController.getSearchedUser)

module.exports=userRouter