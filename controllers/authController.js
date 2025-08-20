const User = require('../model/userModel');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
// Function to create a JWT token
const signToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRES_IN
        });
}
exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            photo: req.body.photo || 'default.jpg',
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });
        const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        // res.cookie('jwt', token, {
        //     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        //     secure: process.env.NODE_ENV === 'production', // Set to true in production
        //     httpOnly: true
        // });
        res.status(201).json({
            status: 'success',
            token: token,
            data: {
                user: newUser
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.login = async (req,res)=>{
    try{
    const email = req.body.email;
    const password = req.body.password;
    // check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide email and password'
        });
    }
    // check if user exists and password is correct
    const user = await User.findOne({email}).select('+password');
    const correct = await user.correctPassword(password, user.password);
    if (!user || !correct) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid email or password'
        });
    }
    // if everything is ok, send token
    const token= signToken(user._id);
    // res.cookie('jwt', token, {
    //         expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    //         secure: process.env.NODE_ENV === 'production', // Set to true in production
    //         httpOnly: true
    //     });
    res.status(200).json({
        status: 'success',
        token: token,
        message: 'User logged in successfully'
    });
    }catch (err) {
        res.status(401).json({
            status: 'fail',
            message: 'Invalid email or password'
        });
    }
};

exports.protect = async (req, res, next) => {
    try{
    let token;
    // 1) Getting token and check if it exists
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //console.log(decoded);
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
    // 4) Check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }
    // Grant access to protected route
    req.user = currentUser;
    next();
    }catch (err) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
}
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array ['admin', 'lead-guide']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
