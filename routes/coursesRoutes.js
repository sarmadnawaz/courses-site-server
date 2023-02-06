import express from "express";
import authController from "../controller/authController.js";
import {
  getCourses,
  getCourse,
  deleteCourses,
  createCourses,
} from "../controller/coursesController.js";
const router = express.Router();

router.get("/", getCourses);

//*** PROTECTED ***//
router.use(authController.protect);
router.get("/:slug", getCourse);
//*** PROTECTED AS WELL AS RESTRICTED ***//
router.use(authController.restrictTo("admin"));
router.post("/", createCourses);
router.delete("/", deleteCourses);

export default router;
