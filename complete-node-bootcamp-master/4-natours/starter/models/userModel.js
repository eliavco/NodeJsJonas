const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'Your username is too long'],
        minlength: [7, 'Your username is too short']
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [40, 'Your email is too long'],
        minlength: [7, 'Your email is too short'],
        validate: [validator.isEmail, 'This is not an email']
    },
    role: {
        type: String,
        enum: ['user' /*, 'guide', 'lead-guide', 'admin'*/],
        default: 'user'
    },
    photo: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        trim: true,
        select: false,
        maxlength: [40, 'Your password is too long'],
        minlength: [8, 'Your password is too short']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'A user must have a password'],
        trim: true,
        select: false,
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            // eslint-disable-next-line prettier/prettier
            message: 'The passwords do not match'
        },
        maxlength: [40, 'Your password is too long'],
        minlength: [8, 'Your password is too short']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiration: Date
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        if (this.passwordChangedAt > Date.now()) return false;

        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpiration = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
