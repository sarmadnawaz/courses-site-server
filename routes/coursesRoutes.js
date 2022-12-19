import express from "express";
import { getCourse, getCourses } from "../controller/coursesController.js";
const router = express.Router();

router.route("/").get(getCourses);
router.route("/:name").get(getCourse);

export default router;
