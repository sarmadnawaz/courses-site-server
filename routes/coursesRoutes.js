import express from "express";
import {
  getCourses,
  getCoursesBySearch,
  getCoursesByCategory,
  getCoursesByTopic,
} from "../controller/coursesController.js";
const router = express.Router();

router.get('/',getCourses);
router.get("/search", getCoursesBySearch);
router.get("/topic/:topic", getCoursesByTopic);
router.get("/category/:category", getCoursesByCategory);

export default router;
