const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllTours = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: 'Invalid'
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: 'Invalid'
        });
    }
};

exports.createNewTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: newTour
        });
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: 'Invalid data sent!',
            devCrash: err
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: 'Invalid'
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: 'Invalid'
        });
    }
};

exports.getDoc = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: 'NO DOCUMENTATION FOUND!'
        });
    }
};

exports.getStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: null,
                    num: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'failure',
            message: 'Invalid'
        });
    }
};

exports.alias = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

// let queryObj;
// if (req.body.query) {
//     queryObj = { ...req.body };
// } else if (req.query) {
//     queryObj = { ...req.query };
// }
// const excludedFields = ['query', 'page', 'sort', 'limit', 'fields'];
// excludedFields.forEach(el => delete queryObj[el]);

// const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

// if (queryObj.or) {
//     const or = queryObj.or;

// };

// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(
//     /\b(gte|gt|lte|lt|or)\b/g,
//     match => `$${match}`
// );
// queryObj = JSON.parse(queryStr);
// query = Tour.find(queryObj);
