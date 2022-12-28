import express from "express";
import cors from 'cors';
import categoriesRouter from "./routes/categoriesRoutes.js";
import coursesRouter from "./routes/coursesRoutes.js";
import imagesRouter from "./routes/imagesRoute.js";
import videosRouter from "./routes/videosRoute.js";

const app = express();

app.use(cors())
app.use(express.json());

app.use("/api/categories", categoriesRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/images", imagesRouter);
app.use("/api/videos", videosRouter);

export default app;
