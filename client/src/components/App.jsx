import React, { Component } from 'react';
import Axios from 'axios';
import Summary from './summary/Summary.jsx';
import Toolbar from './toolbar/Toolbar.jsx';
import ReviewsList from './reviewslist/ReviewsList.jsx';
import PagesCarousel from './pagescarousel/PagesCarousel.jsx';
import styles from '../styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantId: null,
      reviews: [],
      reviewsPerPage: 10,
      currentReviewsPage: 1,
      selectedSortBy: 'Newest',
      selectedFilters: [],
      sortDropdownOpen: false,
      reviewsSummary: { reviewsFilters: [] },
    };
  }

  componentWillMount = () => {
    const restaurantId = Math.floor(Math.random() * 10) + 1;
    this.setState({ restaurantId }, () => {
      this.getAllReviews()
      .then(this.getReviewsSummary);
    });
  };

  getAllReviews = () => {
    return Axios.get(`http://54.153.59.121:3002/api/reviews/all/${this.state.restaurantId}`)
      .then(({data}) => {
        this.setState({ reviews: data });
      });
  };

  getReviewsSummary = () => {
    return Axios.get(`http://54.153.59.121:3002/api/reviews/summary/${this.state.restaurantId}`)
      .then(({data}) => {
        this.setState({ reviewsSummary: data });
      });
  };
  
  selectedReviews = () => {
    let reviews = [...this.state.reviews];
    let selectedFilters = this.state.selectedFilters.map(f => f.toLowerCase());
    let selectedReviews = reviews.filter(review => (
      selectedFilters.every(selectedFilter => (
        selectedFilter.slice(1, 6) === ' star' ?
        review.overall_score === parseInt(selectedFilter[0]) :
        review.review_text.toLowerCase().includes(selectedFilter)
      ))
    ));

    return selectedReviews;
  };

  updateReviewsPage = (pageNumber) => {
    let selectedReviews = this.selectedReviews();
    const totalPages = Math.ceil(selectedReviews.length / this.state.reviewsPerPage);
    const newPageNumber = Math.max(Math.min(pageNumber, totalPages), 1);
    this.setState({ currentReviewsPage: newPageNumber }, () => {
      window.scrollTo(0, 3000);
    });
  };

  updateSelectedSortBy = (sortby) => {
    this.setState({ selectedSortBy: sortby }, this.sortReviews);
  };

  sortReviews = () => {
    let reviews = [...this.state.reviews];
    reviews.sort((a,b) => {
      if (this.state.selectedSortBy === 'Newest') {
        return a.dined_on_date > b.dined_on_date ? -1 : 1;
      } else if (this.state.selectedSortBy === 'Highest Rating') {
        return a.overall_score > b.overall_score ? -1 : 1;
      } else if (this.state.selectedSortBy === 'Lowest Rating') {
        return a.overall_score < b.overall_score ? -1 : 1;
      }
    });

    this.setState({ reviews });
  };

  toggleFilter = (filter) => {
    let selectedFilters = [...this.state.selectedFilters];
    let reviewsSummary = {...this.state.reviewsSummary};

    if (filter.slice(1, 6) === ' Star') {
      selectedFilters.splice(selectedFilters.indexOf(filter), 1);
      reviewsSummary.reviewsFilters.splice(reviewsSummary.reviewsFilters.indexOf(filter), 1);
    } else {
      if (selectedFilters.includes(filter)) {
        selectedFilters.splice(selectedFilters.indexOf(filter), 1);
      } else {
        selectedFilters.push(filter);
      }  
    }

    this.setState({ selectedFilters, reviewsSummary, currentReviewsPage: 1 });
  };

  addOverallScoreFilter = (filter) => {
    let reviewsSummary = {...this.state.reviewsSummary};
    let selectedFilters = [...this.state.selectedFilters];

    reviewsSummary.reviewsFilters = reviewsSummary.reviewsFilters.filter(f => f.slice(1, 6) !== ' Star');
    selectedFilters = selectedFilters.filter(f => f.slice(1, 6) !== ' Star');

    reviewsSummary.reviewsFilters.unshift(filter);
    selectedFilters.unshift(filter);

    this.setState({ reviewsSummary, selectedFilters, currentReviewsPage: 1 }, () => {
      window.scrollTo(0, 3000);
    });
  }

  toggleSortDropdown = () => {
    this.setState({ sortDropdownOpen: !this.state.sortDropdownOpen });
  }

  render = () => (
    <div className={styles.app}>
      <Summary
        reviews={this.state.reviews}
        reviewsSummary={this.state.reviewsSummary}
        selectedFilters={this.state.selectedFilters}
        addOverallScoreFilter={this.addOverallScoreFilter}
        toggleFilter={this.toggleFilter}
      />
      <Toolbar
        reviews={this.state.reviews}
        reviewsSummary={this.state.reviewsSummary}
        selectedSortBy={this.state.selectedSortBy}
        sortDropdownOpen={this.state.sortDropdownOpen}
        updateSelectedSortBy={this.updateSelectedSortBy}
        selectedFilters={this.state.selectedFilters}
        toggleFilter={this.toggleFilter}
        toggleSortDropdown={this.toggleSortDropdown}
      />
      <ReviewsList
        selectedReviews={this.selectedReviews}
        reviewsPerPage={this.state.reviewsPerPage}
        currentReviewsPage={this.state.currentReviewsPage}
      />
      <PagesCarousel
        selectedReviews={this.selectedReviews}
        currentReviewsPage={this.state.currentReviewsPage}
        reviewsPerPage={this.state.reviewsPerPage}
        updateReviewsPage={this.updateReviewsPage}
      />
    </div>
  );
}

export default App;
