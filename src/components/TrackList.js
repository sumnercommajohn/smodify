import React from 'react';
import TrackItem from './TrackItem';
import { matchTracks } from '../helpers/otherHelpers';

class TrackList extends React.Component {
  render() {
    const {
      filteredItems, toggleChecked, ownedByUser,
    } = this.props;
    return (
      <ul className="tracklist">

        {filteredItems
      && filteredItems.map(trackItem => (
        <TrackItem
          key={trackItem.uid}
          uid={trackItem.uid}
          isChecked={trackItem.isChecked}
          album={trackItem.track.album}
          artists={trackItem.track.artists}
          name={trackItem.track.name}
          toggleChecked={toggleChecked}
          ownedByUser={ownedByUser}
        />
      ))}
      </ul>
    );
  }
}

export default TrackList;
