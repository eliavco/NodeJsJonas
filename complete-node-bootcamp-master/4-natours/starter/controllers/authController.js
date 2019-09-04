const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const newUserSend = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        password: '<ENCRYPTED>'
    };

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUserSend
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        next(new AppError('Please provide an email and a password', 400));

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password)))
        next(new AppError('Email or password incorrect', 401));

    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    let token = '';
    if (
        req.headers.Authorization &&
        req.headers.Authorization.startsWith('Bearer ')
    ) {
        token = req.headers.Authorization.split(' ')[1];
    }
    console.log(token);

    next();
});
