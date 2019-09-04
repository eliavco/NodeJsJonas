const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(User.find(), req.body, req.query, User)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const users = await features.query;

    res.status(200).json({
        status: 'success',
        results: {
            users: users.length
        },
        data: {
            users
        }
    });
});

exports.getUser = catchAsync((req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet...'
    });
});

exports.createNewUser = catchAsync((req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet...'
    });
});

exports.updateUser = catchAsync((req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet...'
    });
});

exports.deleteUser = catchAsync((req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined yet...'
    });
});

const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
// eslint-disable-next-line no-useless-escape
const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

JSON.dateParser = function(key, value) {
    if (typeof value === 'string') {
        let a = reISO.exec(value);
        if (a) return new Date(value);
        a = reMsAjax.exec(value);
        if (a) {
            const b = a[1].split(/[-+,.]/);
            return new Date(b[0] ? +b[0] : 0 - +b[1]);
        }
    }
    return value;
};

exports.getStats = catchAsync(async (req, res, next) => {
    const aggregation = JSON.parse(JSON.stringify(req.body), JSON.dateParser);
    const stats = await User.aggregate(aggregation.stages);
    res.status(200).json({
        status: 'success',
        results: stats.length,
        data: {
            stats
        }
    });
});