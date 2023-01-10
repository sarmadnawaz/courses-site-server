import express from "express";
import authController from "../controller/authController.js"
const router = express.Router();

router
.post('/signup', authController.signup)
.post('/signin', authController.signin)
.post('/forgotpassword', authController.forgotPassword)
.post('/resetpassword/:token', authController.resetpassword)
.get('/emailverification/:token', authController.verifyEmail)

export default router;
