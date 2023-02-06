import express from "express";
import cors from "cors";
import categoriesRouter from "./routes/categoriesRoutes.js";
import coursesRouter from "./routes/coursesRoutes.js";
import imagesRouter from "./routes/imagesRoute.js";
import videosRouter from "./routes/videosRoute.js";
import authRouter from "./routes/authRoutes.js";
import errorController from "./controller/errorController.js";
import subscriptionRouter from "./routes/subscriptionRoutes.js";
import { loginConfig } from "./utilz/config.js";
const app = express();

//* GLOBAL VARIABLES *//
app.set("cookie_for_auth", ["locale=en", ""]);
app.set("config_for_login", loginConfig);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/images", imagesRouter);
app.use("/api/videos", videosRouter);
app.use("/api/subscription", subscriptionRouter);

// Middleware to handle all unhandled requests
app.all("*", (req, res, next) => {
  // res.status(404).send(`This Route Doesn't exist. Have a nice day 🫡`)
  next(new Error("Unhandled route"));
});

// Global Middleware function to handle errors
app.use(errorController);
export default app;
