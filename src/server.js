import express from "express";
import morgan from "morgan";
import flash from "express-flash";
import rootRouter from "./routers/root.js"
import videoRouter from "./routers/videoRouter.js";
import userRouter from "./routers/userRouter.js";
import apiRouter from "./routers/apiRouter.js";
import session from "express-session"
import { localsMiddleware } from "./middlewares.js";
import MongoStore from "connect-mongo";

const app = express()

const logger = morgan("dev")

app.set("view engine", "pug")
app.set("views", process.cwd() + "/src/views")

app.use(logger); 
app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.use(
    session({
        secret: process.env.COOKIE_SECRET ,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({mongoUrl: process.env.DB_URL })
    })
)

app.use(flash())
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"))
app.use("/static", express.static("assets"))
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/user", userRouter);
app.use("/api", apiRouter);

export default app;