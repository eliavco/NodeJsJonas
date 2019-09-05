const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.param('id', (req, res, next, val) => {
    // console.log(`This is the id: ${val}`);
    next();
});

// router.param('id', tourController.checkId);
const { protect, restrict } = authController;
// If login is required, add protect as first middleware

router
    .route('/')
    .get(protect, tourController.getAllTours)
    .post(
        /*tourController.checkBody,*/ protect,
        restrict('admin', 'lead-guide'),
        tourController.createNewTour
    );

router
    .route('/top-5-cheap')
    .get(protect, tourController.alias, tourController.getAllTours);

router.route('/stats').get(protect, tourController.getStats);

// ID HAS TO BE THE LAST
router
    .route('/:id')
    .get(protect, tourController.getTour)
    .patch(protect, restrict('admin', 'lead-guide'), tourController.updateTour)
    .delete(
        protect,
        restrict('admin', 'lead-guide'),
        tourController.deleteTour
    );

// router.route('/query/:query').get(tourController.getAllTours);

module.exports = router;
