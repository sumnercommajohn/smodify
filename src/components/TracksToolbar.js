import React from 'react';

class TracksToolbar extends React.Component {
  render() {
    const { selection } = this.props;
    return (
      <div className="tracks-toolbar playlist-track-row">
        <label htmlFor="select-all">
          <input className="checkbox" type="checkbox" id="select-all" />
        </label>
        <div className="toolbar-controls">
          {(selection.length >= 1)
              && (
              <span className="toolbar-controls">{`${selection.length} tracks selected.`}</span>
              )}
        </div>
      </div>
    );
  }
}

export default TracksToolbar;
