import React from 'react';
import TrackItem from './TrackItem';
import { matchTracks } from '../helpers/otherHelpers';

class TrackList extends React.Component {
  state = {
    searchString: '',
  }

  setSearchString = (e) => {
    const searchString = e.target.value;
    this.setState({ searchString });
  }

  render() {
    const {
      items, toggleChecked, ownedByUser,
    } = this.props;
    const { searchString } = this.state;
    const itemsToRender = matchTracks(searchString, items);
    return (
      <ul className="tracklist">
        <div className="filter-bar">
          <input onChange={this.setSearchString} type="text" />
        </div>
        {itemsToRender
      && itemsToRender.map(trackItem => (
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
