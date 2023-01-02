import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  try {
    // Creating New User document in database
    const user = await User.create(req.body);
    // Generating JWT token to keep user logged in
    const token = jwt.sign({ id: user._id }, process.env.PRIVATE_KEY);
    res.status(200).json({
      status: "success",
      message: "User has been successfully created",
        data: {
        isNew : user.isNew,
        token,
        user
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export default {
  signup,
};
