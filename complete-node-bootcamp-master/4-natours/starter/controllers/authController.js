const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

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
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token)
        next(
            new AppError(
                'You are not logged in. Please log in to acces this information',
                401
            )
        );

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
        next(
            new AppError(
                'The user you are trying to log in to, does not longer exist',
                410
            )
        );

    if (currentUser.changedPasswordAfter(decoded.iat))
        next(
            new AppError(
                'The password was recently changed. Please login again',
                403
            )
        );

    req.currentUser = currentUser;

    next();
});

exports.restrict = (...roles) =>
    catchAsync(async (req, res, next) => {
        if (!roles.includes(req.currentUser.role))
            next(
                new AppError(
                    `You cannot access this page. Only a ${roles.join(
                        ', or a '
                    )} can access this page`,
                    403
                )
            );
        next();
    });

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        next(new AppError('User with this email address not found', 404));

    // eslint-disable-next-line no-unused-vars
    const resetToken = user.createPasswordResetToken();
    // take in mind that timestamp is +00 zone
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Please send a PATCH request with password and passwordConfirm to: ${resetURL} . If you did not forget your password, just ignore this email`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 minutes)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpiration = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError('There was a problem reseting your password.', 500)
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //
});
