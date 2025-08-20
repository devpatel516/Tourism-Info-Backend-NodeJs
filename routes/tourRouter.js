const express = require('express');
const router = express.Router();
const { getAllTours,getTour,createTour,deleteTour,getTourStats,TopTours, updateTour, getMonthlyPlan } = require('../controllers/tourController');
const { protect } = require('../controllers/authController');
const {restrictTo} = require('../controllers/authController');
router.route('/top-5-tours').get(TopTours,getAllTours);
router.route('/get-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router
    .route('/')
    .get(protect,getAllTours)
    .post(createTour);
router
    .route('/:id')
    .get(getTour)
    .patch(updateTour) 
    .delete(protect,restrictTo('admin','lead-guide'),deleteTour);
module.exports = router;