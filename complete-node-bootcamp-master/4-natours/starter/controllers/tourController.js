const fs = require('fs');
const Tour = require('./../models/tourModel');

const alias = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};
class APIFeatures {
    constructor(query, body, queryString) {
        this.query = query;
        this.body = body;
        this.queryString = queryString;
    }

    filter() {
        let queryObj;
        if (this.body.query) {
            queryObj = { ...this.body };
        } else if (this.query) {
            queryObj = { ...this.queryString };
        }
        const excludedFields = ['query', 'page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt|or)\b/g,
            match => `$${match}`
        );
        queryObj = JSON.parse(queryStr);
        this.query.find(queryObj);
    }
}

const getAllTours = async (req, res) => {
    try {
        let query;

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        if (req.query.fields) {
            let fields = req.query.fields.split(',');
            if (fields[0][0] === '-') {
                fields.push('-__v');
            }
            fields = fields.join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments();
            if (skip >= numTours) throw new Error('This Page Does Not Exist!');
        }

        const features = new APIFeatures(
            Tour.find(),
            req.body,
            req.query
        ).filter();
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

const getTour = async (req, res) => {
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

const createNewTour = async (req, res) => {
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

const updateTour = async (req, res) => {
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

const deleteTour = async (req, res) => {
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

const getDoc = async (req, res) => {
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

module.exports = {
    getAllTours,
    getTour,
    createNewTour,
    updateTour,
    deleteTour,
    getDoc,
    alias
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