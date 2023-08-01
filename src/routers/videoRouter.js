import express from "express";
import { 
    watch,
    getEdit,
    postEdit,
    getUpload,
    postUpload,
    deleteVideo
} from "../controllers/videoController"

import {protectMiddleware, uploadVideo} from "../middlewares"

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectMiddleware).get(deleteVideo);
videoRouter.route("/upload")
    .all(protectMiddleware)
    .get(getUpload)
    .post(uploadVideo.fields([
        {name:"video", maxCount:1},
        {name:"thumb", maxCount:1},
    ]), 
    postUpload
    );

export default videoRouter;