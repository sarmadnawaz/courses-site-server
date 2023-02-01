import express from "express";
import authController from "../controller/authController.js";
import {
  getCourses,
  getCourse,
  deleteLectures,
  deleteCourses,
  createCourses,
} from "../controller/coursesController.js";
const router = express.Router();

router.get("/", getCourses);

//*** PROTECTED AND RESTRICTED ***/
router.use(authController.protect);
router.get("/:slug", getCourse);
router.use(authController.restrictTo("admin"));
router.post("/", createCourses);
router.delete("/", deleteCourses);
router.delete("/lectures", deleteLectures);

export default router;
