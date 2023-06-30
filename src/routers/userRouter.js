import express from "express";
import {publicMiddleware, protectMiddleware, uploadImg} from "../middlewares"
import {
    logout,
    startGitLogin,
    gitFinish,
    getUserEdit,
    postUserEdit,
    myProfile,
} from "../controllers/userController"

const userRouter = express.Router();

userRouter.get("/logout", protectMiddleware, logout)

userRouter.get("/github/start", publicMiddleware, startGitLogin)

userRouter.get("/github/finish", publicMiddleware, gitFinish)

userRouter
    .route("/my-profile")
    .get(myProfile)

userRouter
    .route("/edit")
    .all(protectMiddleware)
    .get(getUserEdit)
    .post(postUserEdit)

export default userRouter;