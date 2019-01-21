const dbHelpers = require('../db/dbHelpers.js');

module.exports = {
  all: {
    get: async (req, res) => {
      const { restaurantId } = req.params;
      await dbHelpers.getAllReviews(restaurantId)
        .then((data) => { res.status(200).send(data); })
        .catch((err) => { console.error(err); });
    },
    post: async (req, res) => {
      const newReview = req.body;
      const { restaurantId } = req.params;
      await dbHelpers.addReview(newReview, restaurantId)
        .then(() => { res.status(200).send('posted'); })
        .catch((err) => { console.error(err); });
    },
  },
  summary: {
    get: async (req, res) => {
      const { restaurantId } = req.params;
      await dbHelpers.getReviewsSummary(restaurantId)
        .then((data) => {
          const reviewsSummary = {
            ...data[0],
            reviewsFilters: [
              data[0].review_filter_1,
              data[0].review_filter_2,
              data[0].review_filter_3,
              data[0].review_filter_4,
              data[0].review_filter_5,
            ],
          };
          for (let i = 1; i <= 5; i += 1) { delete reviewsSummary[`review_filter_${i}`]; }

          res.status(200).send(reviewsSummary);
        })
        .catch((err) => { console.error(err); });
    },
  },
};
