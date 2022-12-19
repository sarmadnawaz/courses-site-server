import express from "express";
import { getImage } from '../controller/imagesController';
const router = express.Router();


router.get("/:name", getImage);

export default router;
