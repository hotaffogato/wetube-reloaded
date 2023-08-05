import express from "express";
import { 
  registerView, 
  createComment,
  // getEditComment,
  deleteComment 
} from "../controllers/videoController"

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView)
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment)
// apiRouter.get(`/videos/:id([0-9a-f]{24})/comment/commentId/edit`, getEditComment)
apiRouter.get("/videos/:videoId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/delete", deleteComment)


export default apiRouter;