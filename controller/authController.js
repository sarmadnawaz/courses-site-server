import jwt from "jsonwebtoken";
import crypto from 'crypto'
import User from "../models/userModel.js";
import sendEmailVerfication from "../utilz/sendEmailVerfication.js";

const signup = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

const signin = async (req, res) => {
  try {
    // check if email and password is provided
    const { email, password } = req.body;
    if (!email || !password) {
      throw Error("Please provide email and password");
    }
    // checking user and verifying password
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.verifyPassword(password, user.password))) {
      throw Error("Email or password is incorrect");
    }
    if (!user.isVerified) {
      throw Error("Email is not verified")
    }
    // generating awt token
    const token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY);
    // sending success message
    res.status(200).json({
      status: "success",
      token,
      message: "user has been signed in successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    //! Will get token from params object
    const { token } = req.params;
    if (!token) throw Error("Invalid Link");
    //! Hashing the token
    const hashedToken = crypto
    .createHash('sha256')
    .update(token)
      .digest('hex');
    //! Finding User based on hashed token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpires : { $gt : Date.now() }
    })
    if(!user) throw Error('Token has been expired')
    //! Change verify field of user document to true and then save
    user.isVerified = true;
    user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message : "Email has been verified",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

export default {
  signup,
  signin,
  verifyEmail,
};
