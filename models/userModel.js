import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'User must have an unique username'],
        trim : true,
        lowercase : true,
    },
    email: {
        type: String,
        unique: [true, 'Email is already in use of another user'],
        unique: true,
        required: [true, 'User must have an email address'],
        trim : true,
        lowercase : true,
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                return value.length >= 8
            },
            message : 'Password must be at least 8 character long'
        }
    },
    confirmPassword: {
        type: String,
        required: true
    }
  
})

// Comparing password and confirm password
userSchema.pre('save', function (next) {
    if (this.isNew) {
        console.log(this.password, this.confirmPassword)
        if(this.password !== this.confirmPassword) return next(new Error('Confirm password is not matching with password'));
        delete this.confirmPassword
    }
    next()
})

// Hashing the password
userSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
           return  next(err);
        }
        user.password = hash
        next();
    })
})


export default mongoose.model('User', userSchema)