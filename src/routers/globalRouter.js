import express from "express"
import { join, login } from "../controllers/userController"
import { trending } from "../controllers/videoController"

const globalRouter = express.Router();

globalRouter.get("/", trending)


export default globalRouter