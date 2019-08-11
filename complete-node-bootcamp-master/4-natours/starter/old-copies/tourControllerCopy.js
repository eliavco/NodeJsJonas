// * const fs = require('fs');
// const Tour = require('./../models/tourModel');

// const toursDataRelativePath = './../dev-data/data/tours-simple.json';
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/${toursDataRelativePath}`, 'utf-8')
// );

// const checkId = (req, res, next, val) => {
//     const id = req.params.id * 1;
//     const tour = tours.find(el => el.id === id);

//     if (!tour) {
//         res.status(404).json({
//             status: 'failure',
//             message: 'Invalid ID'
//         });
//     } else {
//         req.tour = tour;
//     }

//     next();
// };

// const getAllTours = (req, res) => {
//     res.status(200).json({
//         status: 'success',
//         results: {
//             tours: tours.length
//         },
//         requestedAt: req.requestTime,
//         data: {
//             tours
//         }
//     });
// };

// const getTour = (req, res) => {
//     const { tour } = req;
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
// };

// const checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         res.status(400).json({
//             status: 'failure',
//             message: 'Invalid Body, add name and price'
//         });
//     }
//     next();
// };

// const createNewTour = (req, res) => {
//     // console.log(req.body);

//     const newId = tours[tours.length - 1].id + 1;
//     const newTour = Object.assign({ id: newId }, req.body);
//     tours.push(newTour);
//     fs.writeFile(
//         `${__dirname}/${toursDataRelativePath}`,
//         JSON.stringify(tours),
//         err => {
//             if (err) {
//                 //
//             }
//             res.status(201).json({
//                 status: 'success',
//                 data: newTour
//             });
//         }
//     );
// };

// const updateTour = (req, res) => {
//     res.status(200).json({
//         status: 'success',
//         results: {
//             tours: tours.length
//         },
//         data: {
//             tour: '<Updated Tour here...>'
//         }
//     });
// };

// const deleteTour = (req, res) => {
//     res.status(204).json({
//         status: 'success',
//         results: {
//             tours: tours.length
//         },
//         data: null
//     });
// };

// module.exports = {
//     getAllTours,
//     getTour,
//     createNewTour,
//     updateTour,
//     deleteTour,
//     checkId,
//     checkBody
// };
