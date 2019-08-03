const express = require('express');
const tours = require('./../api-v1/tours');
const router = express.Router();

router
    .route('/')
    .get(tours.getAllTours)
    .post(tours.createNewTour);
router
    .route('/:id')
    .get(tours.getTour)
    .patch(tours.updateTour)
    .delete(tours.deleteTour);

module.exports = router;
