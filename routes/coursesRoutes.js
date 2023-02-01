import express from "express";
import {
  getCourses,
  getCourse,
  deleteLectures,
  deleteCourses,
  createCourses,
} from "../controller/coursesController.js";
const router = express.Router();

router.get('/', getCourses);
router.get('/:slug', getCourse);

// IT WILL BE PROTECTED IN FUTURE
router.post("/", createCourses);
router.delete('/', deleteCourses);
router.delete('/lectures', deleteLectures);

export default router;
