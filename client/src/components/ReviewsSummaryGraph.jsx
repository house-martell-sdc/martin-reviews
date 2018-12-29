import React from 'react';
import ReviewsSummaryGraphRow from './ReviewsSummaryGraphRow.jsx';

const ReviewsSummaryGraph = (props) => (
  <div id="reviewssummarygraph">
    {[5, 4, 3, 2, 1].map((score, i) => (
      <ReviewsSummaryGraphRow
        score={score}
        key={i}
        reviews={props.reviews}
        filterReviewsByScore={props.filterReviewsByScore}
      />
    ))}
  </div>
);

export default ReviewsSummaryGraph;
