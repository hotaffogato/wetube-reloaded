import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/root.js"
import videoRouter from "./routers/videoRouter.js";
import userRouter from "./routers/userRouter.js";
import session from "express-session"
import { localsMiddleware } from "./middlewares.js";

const app = express()

const logger = morgan("dev")

app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views")

app.use(logger); 
app.use(express.urlencoded({ extended : true }));

app.use(
    session({
        secret:"hello",
        resave:true,
        saveUninitialized:true,
    })
)

app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/user", userRouter);

export default app;