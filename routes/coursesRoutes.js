import express from "express";
import authController from "../controller/authController.js";
import { getCourse, getCourses } from "../controller/coursesController.js";
const router = express.Router();

router.route("/").get(authController.protect, getCourses);
router.route("/:name").get(getCourse);

export default router;
