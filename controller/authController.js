import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  try {
    // Creating New User document in database
    const user = await User.create(req.body);
    // Generating JWT token to keep user logged in
    const token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY);
    delete user.password;

    res.status(200).json({
      status: "success",
      message: "User has been successfully created",
      token,
      data: {
        user,
      },
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
    const user = await User.findOne({ email });
    if (!user || !(await user.verifyPassword(password, user.password))) {
      throw Error("invalid credientials");
    }
    // generating awt token
    const token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY);
    delete user.password;
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
export default {
  signup,
  signin,
};
