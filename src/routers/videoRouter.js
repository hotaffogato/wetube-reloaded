import express from "express";
import { 
    watch,
    edit,
} from "../controllers/videoController"



const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch);
videoRouter.get("/:id(\\d+)/edit", edit)

export default videoRouter;