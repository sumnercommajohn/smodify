import React from 'react';

export function FilterBar({ searchString, setSearchString, clearSearchString }) {
  return (
    <div className="filter-bar">
      <input onChange={setSearchString} value={searchString} type="text" />
      {searchString
      && <button type="button" className="clear-filter" onClick={clearSearchString}>X</button>
      }
    </div>
  );
}
