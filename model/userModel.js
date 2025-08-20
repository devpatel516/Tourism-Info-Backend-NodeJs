const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    //name,email,photo,password,passwordConfirm
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        lowercase: true,
        trim: true,
        validate:[validator.isEmail, 'Please provide a valid email address']
    },
    photo: {
        type: String,
        default: 'default.jpg',
    },
    role:{
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
        required: [true, 'A user must have a role']
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: 8,
        select: false // Do not return password in queries
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE, not on UPDATE
            validator: function (val) {
                return val === this.password;
            },
            message: 'Passwords do not match',
        },
    },
    passwordChangedAt: {
        type: Date
    }
});

userSchema.pre('save',async function (next) {
    if(!this.isModified('password')) return next();

    this.password =await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // Remove passwordConfirm after hashing
    next();
});

// Instance method to check if the provided password matches the stored password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
// Instance method to check if the password has been changed after a certain timestamp
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    // If passwordChangedAt is not set, return false
    return false;
};
const User = mongoose.model('User', userSchema);
module.exports = User;