import express from "express";
import categoriesRouter from "./routes/categoriesRoutes.js";
import coursesRouter from "./routes/coursesRoutes.js";
import imagesRouter from "./routes/imagesRoute.js";
const app = express();

app.use(express.json());

app.use("/api/categories", categoriesRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/images", imagesRouter);

export default app;
