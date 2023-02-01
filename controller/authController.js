import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/userModel.js";
import sendEmailVerfication from "../utilz/sendEmailVerfication.js";
import sendPasswordResetToken from "../utilz/sendResetPasswordToken.js";
import catchAsync from "../utilz/catchAsync.js";
import AppError from "../utilz/appError.js";

const signup = catchAsync(async (req, res, next) => {
  //! Creating user document in DB
  req.body.role = 'user'
  req.body.isVerified = false;
  const user = await User.create(req.body);
  const token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY);
  res.status(200).json({
    status: 'success',
    message: "user has been created succesfully. 🫡",
    token,
    data: {
      user
    }
  })
});

const signin = catchAsync(async (req, res, next) => {
  // check if email and password is provided
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide an email and password"));
  // checking user and verifying password
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new AppError("invalid email or password", 401));
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
    message: "user has been logged in successfully. 👍",
    data: {
      data : user
    }
  });
});

//* MIDDLEWARE *\\
const protect = catchAsync(async (req, res, next) => {
  let token;
  // Checking it token is provided in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  if (!token)
    return next(
      new AppError("User is not logged in. Please logged in to get access", 401)
    );
  // Decoding Token
  const { id, iat } = jwt.verify(token, process.env.PRIVATE_KEY);
  // Checking if token belong to any user
  const user = await User.findById(id);
  if (!user)
    return next(
      new AppError(
        "The access token doesn't belong to any user. May be user has been deactivated"
      )
    );
  // Granting Access
  req.user = user;
  next();
});

const restrictTo = (...roles) => catchAsync(async (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError(`${req.user.role} is not authorized to access this route`))
  }
  next();
})

const verifyEmail = catchAsync(async (req, res, next) => {
  let user = req.user;

  //! SENDING Email Verification
  const verificationToken = user.createEmailVerificationToken();
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
      data : {}
    });
})

const emailVerification = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  if (!token) return next(new AppError("Invalid link 🫡", 404));
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
      user
    },
  });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body || req.user;
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

const resetpassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpires: { $gt: Date.now() },
  });
  if (!user)
    return next(new AppError("Invalid token or token is expired", 400));
  const { password, confirmPassword } = req.body;
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.isVerified = true;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  user.isPasswordChanged = true;
  user.passwordUpdatedAt = Date.now();

  await user.save();
  res.status(200).json({
    status: "sucess",
    password: "password has updated",
  });
});

const getUser = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
  token = req.headers.authorization.split(" ")[1];
  if (!token)
    return next(
      new AppError("User is not logged in. Please logged in to get access", 401)
    );
  const { id } = jwt.verify(token, process.env.PRIVATE_KEY);
  const user = await User.findById(id);
  if (!user)
    return next(new AppError("The access token has been expired", 401));
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export default {
  signup,
  signin,
  protect,
  restrictTo,
  emailVerification,
  verifyEmail,
  forgotPassword,
  resetpassword,
  getUser,
};
