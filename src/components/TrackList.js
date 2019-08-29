import React from 'react';
import TrackItem from './TrackItem';

class TrackList extends React.Component {
  render() {
    const {
      items, toggleSelection, toggleChecked, ownedByUser,
    } = this.props;
    return (
      <ul className="tracklist">
        {items
      && items.map(trackItem => (
        <TrackItem
          key={trackItem.uid}
          uid={trackItem.uid}
          isChecked={trackItem.isChecked}
          album={trackItem.track.album}
          artists={trackItem.track.artists}
          name={trackItem.track.name}
          toggleSelection={toggleSelection}
          toggleChecked={toggleChecked}
          ownedByUser={ownedByUser}
        />
      ))}
      </ul>
    );
  }
}

export default TrackList;
