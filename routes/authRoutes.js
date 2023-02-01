import express from "express";
import authController from "../controller/authController.js"
const router = express.Router();

router
    .post('/signup', authController.signup)
    .post('/signin', authController.signin)
    .post('/verifyemail', authController.protect, authController.verifyEmail)
    .patch('/emailverification/:token', authController.emailVerification)
.post('/forgotpassword', authController.forgotPassword)
.patch('/resetpassword/:token', authController.resetpassword)
.get('/me', authController.getUser)

export default router;
