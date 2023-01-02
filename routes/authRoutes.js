import express from "express";
import authController from "../controller/authController.js"
const router = express.Router();

router.
post('/signup', authController.signup)

export default router;