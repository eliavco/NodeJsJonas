const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

router.param('id', (req, res, next, val) => {
    // console.log(`This is the id: ${val}`);
    next();
});

// router.param('id', tourController.checkId);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(/*tourController.checkBody,*/ tourController.createNewTour);
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
