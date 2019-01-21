const db = require('./index.js');

module.exports = {
  getAllReviews: restaurantId => db.query(`
    SELECT
      rd.*,
      u.username,
      u.user_initials,
      u.user_city,
      u.review_count
    FROM reviews_detail rd
    JOIN users u
      ON rd.user_id = u.id
    WHERE restaurant_id =
    ${restaurantId};    
  `),

  addReview: (newReview, restaurantId) => {
    const query = `
      INSERT INTO reviews_detail(restaurant_id, user_id, review_text, overall_score, food_score, service_score, ambience_score, value_score, would_recommend, dined_on_date)
      VALUES(${restaurantId}, ${newReview.user_id}, '${newReview.review_text}', ${newReview.overall_score}, ${newReview.food_score}, ${newReview.service_score}, ${newReview.ambience_score}, ${newReview.value_score}, ${newReview.would_recommend}, '${newReview.dined_on_date}');
    `;
    return db.query(query)
      .then(() => db.query(`
      UPDATE users u
      SET review_count = review_count + 1
      WHERE id = ${newReview.user_id}
    `));
  },

  getReviewsSummary: restaurantId => db.query(`
    SELECT
      restaurant_id,
      COUNT(*) total_reviews,
      CAST(AVG(overall_score) AS DECIMAL(2,1)) avg_overall,
      CAST(AVG(food_score) AS DECIMAL(2,1)) avg_food,
      CAST(AVG(service_score) AS DECIMAL(2,1)) avg_service,
      CAST(AVG(ambience_score) AS DECIMAL(2,1)) avg_ambience,
      CAST(AVG(value_score) AS DECIMAL(2,1)) avg_value,
      SUM(would_recommend::INTEGER) / COUNT(*) pct_recommend
    FROM reviews_detail
    WHERE restaurant_id = ${restaurantId}
    GROUP BY 1;
  `),

};
