import express from "express";
import { edit, logout, startGitLogin, gitFinish } from "../controllers/userController"

const userRouter = express.Router();

userRouter.get("/logout", logout)
userRouter.get("/edit", edit);
userRouter.get("/github/start", startGitLogin)
userRouter.get("/github/finish", gitFinish)



export default userRouter;