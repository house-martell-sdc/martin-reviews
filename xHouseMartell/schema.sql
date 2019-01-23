DROP DATABASE IF EXISTS tableit;

CREATE DATABASE tableit;

USE tableit;

CREATE TABLE restaurants (
  id serial PRIMARY KEY,
  restaurant_name VARCHAR(255)
);

CREATE TABLE users (
  id serial PRIMARY KEY,
  username VARCHAR(255),
  user_initials VARCHAR(2),
  user_city VARCHAR(255)
);

CREATE TABLE review_filters (
  id serial PRIMARY KEY,
  restaurant_id INTEGER,
  review_filter VARCHAR(55),
  foreign key(restaurant_id) references restaurants(id)
);

CREATE TABLE reviews_detail (
  id serial PRIMARY KEY,
  restaurant_id INTEGER,
  user_id INTEGER,
  review_text TEXT,
  overall_score SMALLINT,
  food_score SMALLINT,
  service_score SMALLINT,
  ambience_score SMALLINT,
  value_score SMALLINT,
  would_recommend BOOLEAN,
  dined_on_date DATE,
  foreign key(restaurant_id) references restaurants(id),
  foreign key(user_id) references users(id)
);


// to seed

copy restaurants(restaurant_name)
from '/Users/Iris/martin-reviews/xHouseMartell/restaurantData.csv' delimiter ',' csv;

copy users(username, user_initials, user_city)
from '/Users/Iris/martin-reviews/xHouseMartell/userData.csv' delimiter ',' csv;

copy review_filters(restaurant_id, review_filter)
from '/Users/Iris/martin-reviews/xHouseMartell/reviewFiltersData.csv' delimiter ',' csv;

copy reviews_detail(restaurant_id, user_id, review_text, overall_score, food_score, service_score, ambience_score, value_score, would_recommend, dined_on_date)
from '/Users/Iris/martin-reviews/xHouseMartell/reviewsDetailData.csv' delimiter ',' csv;

// CSV files moved to diff folder

\copy restaurants(restaurant_name) from '/Users/Iris/CSV/restaurantData.csv' delimiter ',' csv;

\copy users(username, user_initials, user_city) from '/Users/Iris/CSV/userData.csv' delimiter ',' csv;

\copy review_filters(restaurant_id, review_filter) from '/Users/Iris/CSV/reviewFiltersData.csv' delimiter ',' csv;

\copy reviews_detail(restaurant_id, user_id, review_text, overall_score, food_score, service_score, ambience_score, value_score, would_recommend, dined_on_date) from '/Users/Iris/CSV/reviewsDetailData.csv' delimiter ',' csv;



/// Mongo schema


mongoimport --db tableit --collection restasurants --type csv --file /Users/Iris/martin-reviews/xHouseMartell/restaurantData.csv --headerline

mongoimport --db tableit --collection users --type csv --file /Users/Iris/martin-reviews/xHouseMartell/userData.csv --headerline

mongoimport --db tableit --collection reviews_detail --type csv --file /Users/Iris/martin-reviews/xHouseMartell/reviewsDetailData.csv --headerline

mongoimport --db tableit --collection review_filters --type csv --file /Users/Iris/martin-reviews/xHouseMartell/reviewFiltersData.csv --headerline

mongoimport --db testtable --collection users --type csv --file /Users/Iris/martin-reviews/xHouseMartell/mongoUserData.csv --headerline


UPDATE users u
SET review_count = user_total_reviews
FROM (
  SELECT
    user_id,
    COUNT(*) user_total_reviews
  FROM reviews_detail rd
  -- WHERE user_id = x
  GROUP BY user_id
)a
WHERE u.id = a.user_id;

// sub-query where it is counting all and grouping count by user_id => called user_total_reviews
// sub-query is a table with user_id as one row, user_total_reviews as the other
// so ultimately setting review_count to user_total_reviews where user.id = a.user_id


db.reviews_detail.explain('executionStats').aggregate([
  {
    $lookup:
    {
      from: 'users',
      localField: 'user_id',
      foreignField: '_id',
      as: 'user_data'
    }
  },
  {
    $match: {restaurant_id: 992233}
  },
  {
    $unwind: '$user_data'
  },
  {
    $project: {
      _id: 0,
      'user_data._id': 0
    }
  }
]).pretty()

-- db.users.aggregate([
--   {
--     $lookup:
--     {
--       from: 'reviews_detail',
--       localField: '_id',
--       foreignField: 'user_id',
--       as: 'reviews'
--     }
--   },
--   {
--     $match: {"reviews.restaurant_id": 992233}
--   }
-- ]).pretty()


/// count 
db.reviews_detail.aggregate([
  {
    $group:
    {
      _id: '$user_id',
      count: {$sum: 1}
    }
  }
]).pretty()

