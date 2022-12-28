import express from "express";
import { getVideo } from "../controller/videosController.js";
const router = express.Router();

router.get("/:name", getVideo);

export default router;
