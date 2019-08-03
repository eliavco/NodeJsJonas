const fs = require('fs');
const toursDataRelativePath = './dev-data/data/tours-simple.json';
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/${toursDataRelativePath}`, 'utf-8')
);

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: {
            tours: tours.length
        },
        requestedAt: req.requestTime,
        data: {
            tours
        }
    });
};

const getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (tour) {
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } else {
        res.status(404).json({
            status: 'failure',
            message: 'Invalid ID'
        });
    }
};

const createNewTour = (req, res) => {
    // console.log(req.body);

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/${toursDataRelativePath}`,
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                status: 'success',
                data: newTour
            });
        }
    );
};

const updateTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (tour) {
        res.status(200).json({
            status: 'success',
            results: {
                tours: tours.length
            },
            data: {
                tour: '<Updated Tour here...>'
            }
        });
    } else {
        res.status(404).json({
            status: 'failure',
            message: 'Invalid ID'
        });
    }
};

const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if (tour) {
        res.status(204).json({
            status: 'success',
            results: {
                tours: tours.length
            },
            data: null
        });
    } else {
        res.status(404).json({
            status: 'failure',
            message: 'Invalid ID'
        });
    }
};

module.exports = {
    getAllTours,
    getTour,
    createNewTour,
    updateTour,
    deleteTour
};
