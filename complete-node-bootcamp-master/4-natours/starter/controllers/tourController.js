const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.body, req.query, Tour)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const tours = await features.query;

    res.status(200).json({
        status: 'success',
        results: {
            tours: tours.length
        },
        data: {
            tours
        }
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
});

exports.createNewTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: newTour
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        upsert: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getDoc = catchAsync(async (req, res, next) => {
    const documentation = await JSON.parse(
        fs.readFileSync(
            `${__dirname}/../dev-data/data/api-documentation.json`,
            'utf-8'
        )
    );
    res.status(200).json({
        status: 'success',
        data: documentation
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
    const stats = await Tour.aggregate(aggregation.stages);
    res.status(200).json({
        status: 'success',
        results: stats.length,
        data: {
            stats
        }
    });
});

exports.alias = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};
