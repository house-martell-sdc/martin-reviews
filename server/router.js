const router = require('express').Router();
const controller = require('./controller.js');

router
  .route('/reviews/all/:restaurantId')
  .get(controller.all.get)
  .post(controller.all.post);

router
  .route('/reviews/summary/:restaurantId')
  .get(controller.summary.get);

router
  .route('/reviews/filters/:restaurantId');

module.exports = router;
