import React from 'react';

class TracksToolbar extends React.Component {
  handleChange = () => {
    const { toggleCheckedAll, allTracksChecked } = this.props;
    toggleCheckedAll(allTracksChecked);
  };

  printNumberOfChecked = () => {
    const { numberOfChecked } = this.props;
    const trackOrTracks = (numberOfChecked === 1) ? 'track' : 'tracks';
    return `${numberOfChecked} ${trackOrTracks} selected`;
  }

  render() {
    const {
      clearSelection, allTracksChecked, numberOfChecked,
      deleteSelectedTracks, ownedByUser, toggleSelectPlaylist,
    } = this.props;

    return (
      <div className="tracks-toolbar playlist-track-row">
        <label className="checkbox-label" htmlFor="select-all">
          <input className="checkbox" type="checkbox" id="select-all" onChange={this.handleChange} checked={allTracksChecked} />
        </label>
        <div className="toolbar-controls">
          {(numberOfChecked >= 1)
              && (
                <>
                  {this.printNumberOfChecked()}
                  <button type="button" className="clear-selection" onClick={clearSelection}>X</button>
                  <button type="button" className="action remove-tracks" onClick={toggleSelectPlaylist}>Add To...</button>
                  {ownedByUser && (
                  <button type="button" className="danger remove-tracks" onClick={deleteSelectedTracks}>Remove</button>
                  )}
                </>
              )}
        </div>
      </div>
    );
  }
}

export default TracksToolbar;
