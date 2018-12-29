import React from 'react';

const ReviewsPagesCarouselDirectionButton = (props) => (
  <div className="pagedirectionbutton" onClick={
    () => {props.updateReviewsPage((props.direction === 'next' ? props.currentReviewsPage + 1 : props.currentReviewsPage - 1));}
  }>
    {
      props.direction === 'next' ? 
      <img className="changereviewspagebutton" src="https://s3-us-west-1.amazonaws.com/gitbuckets/hrla26-fec-tableit/tableit_next_page_button.png"></img> :
      <img className="changereviewspagebutton" src="https://s3-us-west-1.amazonaws.com/gitbuckets/hrla26-fec-tableit/tableit_prev_page_button.png"></img>
    }
  </div>
);

export default ReviewsPagesCarouselDirectionButton;