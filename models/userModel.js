import mongoose from "mongoose";
import crypto from 'crypto'
import bcrypt from "bcrypt";
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
    required: true,
    validate: {
      validator(value) {
        return value.length >= 8;
      },
      message: "Password must be at least 8 character long",
    },
    select : false
  },
  confirmPassword: {
    type: String,
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
  }
});

// Comparing password and confirm password
userSchema.pre("save", function (next) {
  if (this.isNew) {
    console.log(this.password, this.confirmPassword);
    if (this.password !== this.confirmPassword)
      return next(new Error("Confirm password is not matching with password"));
    this.confirmPassword = undefined;
  }
  next();
});

// Hashing the password
userSchema.pre("save", function (next) {
  const user = this;
  if (this.isNew) {
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
    });
  }
  next();
});

//** METHODS **//

userSchema.methods.verifyPassword = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};

userSchema.methods.createEmailVerificationToken = function (id) {
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
