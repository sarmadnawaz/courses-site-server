import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/userModel.js";
import sendEmailVerfication from "../utilz/sendEmailVerfication.js";
import sendPasswordResetToken from "../utilz/sendResetPasswordToken.js";
import catchAsync from "../utilz/catchAsync.js";
import AppError from "../utilz/appError.js";

const signup = catchAsync(async (req, res, next) => {
  //! Creating user document in DB
  req.body.isVerified = false;
  const user = await User.create(req.body);
  //! Email Verification
  const verificationToken = user.createEmailVerificationToken(user._id);
  await sendEmailVerfication({
    email: user.email,
    token: verificationToken,
    protocol: req.protocol,
    host: req.get("host"),
  });
  //! Saving document
  await user.save({ validateBeforeSave: false });
  //! Success message
  res.status(200).json({
    status: "success",
    message: "Email verification link has been sent at user email address",
  });
});

const signin = catchAsync(async (req, res, next) => {
  // check if email and password is provided
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide an email and password"));
  // checking user and verifying password
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next("Incorrect email or password");
  }
  if (!user.isVerified) {
    return next(new AppError("Email is not verified", 401));
  }
  // generating awt token
  const token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY);
  // sending success message
  res.status(200).json({
    status: "success",
    token,
    message: "user has been signed in successfully",
  });
});

const verifyEmail = catchAsync(async (req, res, next) => {
  //! Will get token from params object
  const { token } = req.params;
  if (!token) return next(new AppError("invalid link 🫡", 404));
  //! Hashing the token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  //! Finding User based on hashed token
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpires: { $gt: Date.now() },
  });
  if (!user) return next(new AppError("Token has been expired", 403));
  //! Change verify field of user document to true and then save
  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Email has been verified",
    data: {
      user,
    },
  });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) next(new AppError("Please provide us your email"));
  const user = await User.findOne({ email });
  if (!user) next(new AppError("User Not Found"));
  const token = user.createResetPasswordToken();
  await sendPasswordResetToken({
    email: user.email,
    token,
    protocol: req.protocol,
    host: req.get("host"),
  });
  user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: `Reset Password Link has been send to ${user.email}.`,
  });
});

export default {
  signup,
  signin,
  verifyEmail,
  forgotPassword,
};
