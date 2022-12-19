import express from "express";
import {
  createCategory,
  getCategories,
} from "../controller/categoriesController.js";
const router = express.Router();

router.route("/").post(createCategory);
router.route("/").get(getCategories);
export default router;
