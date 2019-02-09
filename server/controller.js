const dbHelpers = require('../db/dbHelpers.js');

module.exports = {
  all: {
    get: async (req, res) => {
      const { restaurantId } = req.params;
      await dbHelpers.getAllReviews(restaurantId)
        .then((data) => { res.status(200).send(data.rows); })
        .catch((err) => { console.error(err); });
    },
    post: async (req, res) => {
      const newReview = req.body;
      const { restaurantId } = req.params;
      try {
        await dbHelpers.addReview(newReview, restaurantId);
        res.status(200).send('posted');
      } catch (error) {
        console.error(error);
      }
      // await dbHelpers.addReview(newReview, restaurantId)
      //   .then(() => { res.status(200).send('posted'); })
      //   .catch((err) => { console.error(err); });
    },
  },
  summary: {
    get: async (req, res) => {
      const { restaurantId } = req.params;
      await dbHelpers.getReviewsSummary(restaurantId)
        .then((data) => {
          const reviewsSummary = {
            ...data.rows[0],
            reviewsFilters: [
              "Burgers",
              "Burritos",
              "Pizzas",
              "Tacos",
              "Sandwiches"
            ],
          };
          res.status(200).send(reviewsSummary);
        })
        .catch((err) => { console.error(err); });
    },
  },
};
