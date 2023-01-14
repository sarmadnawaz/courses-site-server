import mongoose from "mongoose";
import crypto from 'crypto'
import bcrypt from "bcrypt";
import validator from "validator";
import { urlToHttpOptions } from "url";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "User must have an unique username"],
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "User must have an email address"],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
    minlength : 8,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator(el) {
        return el === this.password;
      },
      message: "Passwords are not matching with confirm password",
    },
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationTokenExpires: {
    type: String,
    select : false
  },
  resetPasswordToken: {
    type: String,
    select: false,
  },
  resetPasswordTokenExpires: {
    type: Date,
    select : false
  },
  createdAt: {
    type: Date,
    default : Date.now,
    select : false
  },
  passwordUpdatedAt: {
    type: Date,
    select: false
  },
  isPasswordChanged: {
    type: Boolean,
  }
});

// Comparing password and confirm password
// userSchema.pre("save", function (next) {
//   if (this.isNew) {
//     console.log(this.password, this.confirmPassword);
//     if (this.password !== this.confirmPassword)
//       return next(new Error("Confirm password is not matching with password"));
//     this.confirmPassword = undefined;
//   }
//   next();
// });

// Hashing the password
userSchema.pre("save", async function (next) {
  const user = this;
  if (this.isNew || this.isPasswordChanged) {
    this.isPasswordChanged = undefined
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
  }
  next();
});

//** METHODS **//

userSchema.methods.verifyPassword = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};

userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.emailVerificationTokenExpires = Date.now() + 10 * 60 * 1000;
  return verificationToken;
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
}

export default mongoose.model("User", userSchema);
