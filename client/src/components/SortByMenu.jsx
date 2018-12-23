import React from 'react';
import SortBySelect from './SortBySelect.jsx';
import SortByDropdown from './SortByDropdown.jsx';

const SortbyMenu = (props) => (
  <div id="sortbymenu">
    <div>Sort by</div>
    <SortBySelect 
      selectedSortBy={props.selectedSortBy}
      sortDropdownOpen={props.sortDropdownOpen}
      toggleSortDropdown={props.toggleSortDropdown}
    />
    {props.sortDropdownOpen ? 
    <SortByDropdown
      selectedSortBy={props.selectedSortBy}
      updateSelectedSortBy={props.updateSelectedSortBy}
    />
    : null}
  </div>
);

export default SortbyMenu;