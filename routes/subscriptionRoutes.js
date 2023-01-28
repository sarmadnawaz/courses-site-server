import express from 'express'
import subscriptionController from '../controller/subscriptionController.js';
import authController from '../controller/authController.js';
const router = express.Router();
router.post('/checkout-session/:plan', authController.protect, subscriptionController.createCheckoutSession);
//* 
router.post('/', subscriptionController.createSubscription)
export default router;