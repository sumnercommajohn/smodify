import React from 'react';

class SelectPlaylistItem extends React.PureComponent {
  handleChange = (e) => {
    const { playlist: { id }, toggleChecked } = this.props;
    toggleChecked(id);
  }

  render() {
    const {
      playlist: { isChecked, name, id },
    } = this.props;
    const itemClass = `playlist-track-row${isChecked ? ' checked' : ''}`;

    return (
      <li className={itemClass}>
        <label className="checkbox-label" htmlFor={id}>
          <input className="checkbox" type="checkbox" id={id} onChange={this.handleChange} checked={isChecked} />
        </label>
        <div className="song-details">
          <span className="song-title">{name}</span>
        </div>
      </li>
    );
  }
}

export default SelectPlaylistItem;
