import AppError from "../utilz/appError.js";
import catchAsync from "../utilz/catchAsync.js";
import Subscription from '../models/subscriptionModel.js';
import Stripe from "stripe";

const createCheckoutSession = catchAsync(async (req, res, next) => {
  const { plan } = req.params;
  const subscription = await Subscription.findOne({ name : plan });
  if (!subscription) {
    return next(
      new AppError("There are only two subscrption plan Standard and Premium")
      );
    }
    const stripe = Stripe(
      process.env.STRIPE_PRIVATE_KEY
    );
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: req.user.email,
    client_reference_id: subscription._id,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${subscription.name} subscription plan`,
          },
          unit_amount: subscription.price * 100,
        },
        quantity: 1,
      }
    ],
    success_url: `http://localhost:3001/subscription/${plan}/payment/succeed?price=${subscription.price * 100}`,
    cancel_url: `http://localhost:3001/subscription/${plan}/payment/rejected`,
  });
  res.status(200).json({
    status: "success",
    url: session.url,
  });
});

const createSubscription = catchAsync(async (req, res, next) => {
  const subscripiton = await Subscription.create(req.body);
  res.status(200).json({
    status: "success",
    message: "subscription plan has been created",
    data  : { data : subscripiton }
  })
})

export default { createSubscription, createCheckoutSession }