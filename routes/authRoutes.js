import express from "express";
import authController from "../controller/authController.js"
const router = express.Router();

router
.post('/signup', authController.signup)
.post('/signin', authController.signin)


export default router;
