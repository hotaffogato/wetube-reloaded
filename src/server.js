import express from "express";
import morgan from "morgan";
import global from "./routers/globalRouter.js"
import videoRouter from "./routers/videoRouter.js";
import userRouter from "./routers/userRouter.js";

const app = express()
const PORT = 4000;
const logger = morgan("dev")

app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views")

app.use(logger); 
app.use(express.urlencoded({ extended : true }))

app.use("/", global)
app.use("/video", videoRouter)
app.use("/user", userRouter)

const handelListening = () => 
    console.log(`Server listening on port http://localhost:${PORT}`)
 
app.listen(PORT, handelListening)

