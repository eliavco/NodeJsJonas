const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getAllTours = catchAsync(async (req, res, next) => {
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
});

exports.getTour = catchAsync(async (req, res, next) => {
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
});

exports.createNewTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: newTour
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
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
});

exports.deleteTour = catchAsync(async (req, res, next) => {
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
});

exports.getDoc = catchAsync(async (req, res, next) => {
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
    try {
        const aggregation = JSON.parse(
            JSON.stringify(req.body),
            JSON.dateParser
        );
        const stats = await Tour.aggregate(aggregation.stages);
        res.status(200).json({
            status: 'success',
            results: stats.length,
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
});

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

// const aggregation = [
//     {
//         $match: { ratingsAverage: { $gte: 4.5 } }
//     },
//     {
//         $group: {
//             // _id: /*null*/ '$ratingsAverage',
//             _id: { $toUpper: '$difficulty' },
//             num: { $sum: 1 },
//             numRatings: { $sum: '$ratingsQuantity' },
//             avgRating: { $avg: '$ratingsAverage' },
//             avgPrice: { $avg: '$price' },
//             minPrice: { $min: '$price' },
//             maxPrice: { $max: '$price' }
//         }
//     },
//     {
//         $sort: { avgPrice: 1 }
//     },
//     {
//         $match: { _id: { $ne: 'EASY' } }
//     }
// ];

// {
//     "stages": [
// 		{
// 		    "$match": { "ratingsAverage": { "$gte": 4.5 } }
// 		},
// 		{
// 		    "$group": {
// 		        "_id": { "$toUpper": "$difficulty" },
// 		        "num": { "$sum": 1 },
// 		        "numRatings": { "$sum": "$ratingsQuantity" },
// 		        "avgRating": { "$avg": "$ratingsAverage" },
// 		        "avgPrice": { "$avg": "$price" },
// 		        "minPrice": { "$min": "$price" },
// 		        "maxPrice": { "$max": "$price" }
// 		    }
// 		},
// 		{
// 		    "$sort": { "avgPrice": 1 }
// 		},
// 		{
// 		    "$match": { "_id": { "$ne": "EASY" } }
// 		}
//     ]
// }

// {
//     "stages": [
// 		{
// 		    "$unwind": "$startDates"
// 		},
// 		{
// 			"$match": {
// 				"startDates": {
// 					"$gte": "2021-01-01T00:00:00.000Z",
// 					"$lt": "2022-01-01T00:00:00.000Z"
// 				}
// 			}
// 		},
// 		{
// 			"$group": {
// 				"_id": {
// 					"$month": "$startDates"
// 				},
// 				"numTourStarts": {
// 					"$sum": 1
// 				},
// 				"tours": {
// 					"$push": "$name"
// 				}
// 			}
// 		},
// 		{
// 			"$addFields": {
// 				"month": "$_id"
// 			}
// 		},
// 		{
// 			"$project": {
// 				"_id": 0
// 			}
// 		},
// 		{
// 			"$sort": {
// 				"numTourStarts": -1
// 			}
// 		},
// 		{
// 			"$limit": 6
// 		}
//     ]
// }
