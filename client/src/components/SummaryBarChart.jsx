import React from 'react';
import SummaryBarChartRow from './SummaryBarChartRow.jsx';

const SummaryBarChart = (props) => (
  <div id="summarybarchart">
    {[5, 4, 3, 2, 1].map((score, i) => (
      <SummaryBarChartRow
        score={score}
        key={i}
        reviews={props.reviews}
        selectedFilters={props.selectedFilters}
        filterReviewsByScore={props.filterReviewsByScore}
        addOverallScoreFilter={props.addOverallScoreFilter}
        toggleFilter={props.toggleFilter}
      />
    ))}
  </div>
);

export default SummaryBarChart;