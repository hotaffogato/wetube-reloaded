import express from "express"
import { join, login } from "../controllers/userController"
import { home } from "../controllers/videoController"

const globalRouter = express.Router();

globalRouter.get("/", home)


export default globalRouter