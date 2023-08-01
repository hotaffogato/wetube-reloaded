import express from "express";
import {
    protectMiddleware, 
    uploadImg,
} from "../middlewares"
import {
    logout,
    getEdit,
    postEdit,
    profile,
} from "../controllers/userController"

const userRouter = express.Router();

userRouter.get("/logout", protectMiddleware, logout)

userRouter.get("/:id", profile)

userRouter
    .route("/:id/edit")
    .all(protectMiddleware)
    .get(getEdit)
    .post(uploadImg.fields("avatar"), postEdit);

export default userRouter;