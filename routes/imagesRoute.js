import express from "express";
import { getImage } from "../controller/imagesController.js";
const router = express.Router();

router.get("/:name", getImage);

export default router;
